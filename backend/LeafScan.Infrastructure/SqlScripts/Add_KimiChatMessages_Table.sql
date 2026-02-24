-- KimiChatMessages table for storing Kimi AI chat history
-- Run this if not using EF migrations
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'KimiChatMessages')
BEGIN
    CREATE TABLE [dbo].[KimiChatMessages] (
        [Id] BIGINT IDENTITY(1,1) NOT NULL,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [SessionId] UNIQUEIDENTIFIER NOT NULL,
        [Role] NVARCHAR(20) NOT NULL,
        [Content] NVARCHAR(MAX) NOT NULL,
        [CreatedAtUtc] DATETIME2 NOT NULL,
        CONSTRAINT [PK_KimiChatMessages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_KimiChatMessages_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_KimiChatMessages_UserId_SessionId] ON [dbo].[KimiChatMessages] ([UserId], [SessionId]);
    CREATE INDEX [IX_KimiChatMessages_CreatedAtUtc] ON [dbo].[KimiChatMessages] ([CreatedAtUtc]);
END
GO
