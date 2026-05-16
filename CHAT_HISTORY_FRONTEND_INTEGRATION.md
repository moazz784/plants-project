# Chat History Frontend Integration Guide

The backend now persists every Kimi chat message per user and exposes endpoints
to list and load past sessions. This replaces the localStorage-only history in
`src/Home.jsx` with real server-side history that survives device changes and
clearing browser storage.

---

## The Three New Endpoints

All three require an authenticated user (JWT cookie — already handled by `api.js`).

### `GET /api/chat/sessions`
List every chat session for the logged-in user, ordered newest activity first.

**Response:**
```json
[
  {
    "sessionId": "9f1e2b3a-...-...",
    "title": "How often should I water tomatoes?",
    "lastActivityUtc": "2026-05-14T18:42:11Z",
    "messageCount": 8
  },
  {
    "sessionId": "...",
    "title": "What soil is best for basil?",
    "lastActivityUtc": "2026-05-13T09:15:00Z",
    "messageCount": 4
  }
]
```

`title` is the first user message in the session. Truncate it for display in the sidebar.

### `GET /api/chat/sessions/{sessionId}`
Load all messages inside a session, in chronological order.

**Response (200):**
```json
[
  { "role": "user",      "content": "How often should I water tomatoes?", "createdAtUtc": "2026-05-14T18:30:00Z" },
  { "role": "assistant", "content": "Tomatoes typically need...",         "createdAtUtc": "2026-05-14T18:30:02Z" },
  { "role": "user",      "content": "What about during summer?",          "createdAtUtc": "2026-05-14T18:41:00Z" },
  { "role": "assistant", "content": "In hot weather...",                  "createdAtUtc": "2026-05-14T18:41:03Z" }
]
```

**Errors:** `404 SESSION_NOT_FOUND` if no messages match (also returned for sessions owned by other users — never leaks).

### `DELETE /api/chat/sessions/{sessionId}`
Permanently delete a session and all its messages.

**Response:** `204 No Content` on success, `404 SESSION_NOT_FOUND` otherwise.

---

## Step 1 — Update `src/api.js`

The existing `chat` block:
```js
chat: {
  send: (sessionId, messages, language) =>
    api.post('/chat', { sessionId, messages, language }),
}
```

Replace it with:
```js
chat: {
  send: (sessionId, messages, language) =>
    api.post('/chat', { sessionId, messages, language }),

  getSessions: () =>
    api.get('/chat/sessions'),

  getSession: (sessionId) =>
    api.get(`/chat/sessions/${sessionId}`),

  deleteSession: (sessionId) =>
    api.delete(`/chat/sessions/${sessionId}`),
}
```

(Use whatever HTTP helper pattern `api.js` already uses — the names above are illustrative.)

---

## Step 2 — Wire `src/Home.jsx` to the backend

### a) Track the current session

Add one more state hook next to the existing chat state (around line 39):
```jsx
const [currentSessionId, setCurrentSessionId] = useState(null);
```

### b) Switch `sendMessage` from Ollama to the backend

Replace the body of `sendMessage` (lines ~73–93) with a call to `api.chat.send`:
```jsx
const sendMessage = async () => {
  if (!inputValue.trim()) return;

  const userText = inputValue;
  const userMessage = { type: 'text', content: userText, sender: 'user' };
  setMessages(prev => [...prev, userMessage]);
  setInputValue('');

  const thinkingId = Date.now();
  setMessages(prev => [...prev, {
    id: thinkingId,
    type: 'text',
    content: isArabic ? 'جاري التفكير...' : 'Thinking...',
    sender: 'bot',
  }]);

  try {
    // Build the full conversation in the backend's expected shape
    const conversation = [...messages, userMessage].map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    const res = await api.chat.send(
      currentSessionId,         // null on first message → backend creates one
      conversation,
      i18n.language || 'en'
    );

    setCurrentSessionId(res.sessionId);  // remember it for the next message
    setMessages(prev => prev.map(msg =>
      msg.id === thinkingId ? { ...msg, content: res.content } : msg
    ));
  } catch (err) {
    setMessages(prev => prev.map(msg =>
      msg.id === thinkingId
        ? { ...msg, content: isArabic ? 'عذراً، حدث خطأ.' : 'Sorry, something went wrong.' }
        : msg
    ));
  }
};
```

### c) Load history from the backend instead of localStorage

Replace the `chatHistory` initialization (lines ~52–55) and remove the `useEffect`
that syncs to localStorage (lines ~100–103). Then load sessions when the chat opens:

```jsx
const [chatHistory, setChatHistory] = useState([]);

useEffect(() => {
  if (!openChat) return;
  api.chat.getSessions()
    .then(setChatHistory)
    .catch(() => setChatHistory([]));
}, [openChat]);
```

### d) Click a history item — load real messages

Replace the inline `onClick` that loads from localStorage (around line 488):
```jsx
<button
  key={item.sessionId}
  onClick={async () => {
    const msgs = await api.chat.getSession(item.sessionId);
    setMessages(msgs.map(m => ({
      type: 'text',
      content: m.content,
      sender: m.role === 'user' ? 'user' : 'bot',
    })));
    setCurrentSessionId(item.sessionId);
    setShowHistory(false);
  }}
  className="..."
>
  {item.title.length > 30 ? item.title.slice(0, 30) + '…' : item.title}
</button>
```

(Note `item.sessionId` and `item.title` come from the new endpoint — different field names than the old localStorage shape.)

### e) "New chat" button — just clear state

Replace `startNewChat` (lines ~57–67) with:
```jsx
const startNewChat = async () => {
  setMessages([]);
  setCurrentSessionId(null);
  // Refresh the sidebar so the session we just left shows up
  try {
    setChatHistory(await api.chat.getSessions());
  } catch {}
};
```

No more saving to localStorage — the previous conversation is already persisted server-side as each message was sent.

### f) Optional — delete button per history item

In the history sidebar, next to each session button:
```jsx
<button
  onClick={async (e) => {
    e.stopPropagation();
    await api.chat.deleteSession(item.sessionId);
    setChatHistory(prev => prev.filter(s => s.sessionId !== item.sessionId));
    if (currentSessionId === item.sessionId) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  }}
  className="..."
  aria-label="Delete chat"
>
  🗑
</button>
```

---

## Step 3 — Drop the localStorage cleanup (optional)

After the change is shipped you can also remove the old `leafScan_history` key on first load:
```js
localStorage.removeItem('leafScan_history');
```

---

## Field-name mapping (backend ↔ frontend)

| Backend                                 | Frontend `messages[]` item             |
|-----------------------------------------|----------------------------------------|
| `role: "user"`                          | `sender: 'user'`                       |
| `role: "assistant"`                     | `sender: 'bot'`                        |
| `content`                               | `content`                              |
| `createdAtUtc`                          | (not stored in current frontend state) |

| Backend session list item               | Old localStorage history item          |
|-----------------------------------------|----------------------------------------|
| `sessionId` (GUID)                      | `id` (timestamp)                       |
| `title` (first user message, full text) | `title` (first 25 chars)               |
| `lastActivityUtc`                       | (not present)                          |
| `messageCount`                          | (not present)                          |

---

## Notes

- **Auth required:** all three endpoints return 401 without a valid JWT cookie. The existing `AuthGuard` already protects routes that use chat.
- **No leakage:** `GET /api/chat/sessions/{id}` filters by `userId` server-side. If user A asks for user B's session id, they get a 404 — same as if it didn't exist.
- **No new DB migration needed.** The `KimiChatMessages` table and its `(UserId, SessionId)` index already exist.
