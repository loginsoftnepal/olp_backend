import { ConnectionRequest } from 'src/connection-requests/connection-request.entity';
import { Connection } from 'src/connection/connection.entity';
import { Conversation } from 'src/conversations/conversation.entity';
import UpdateEducationDto from 'src/education/dto/updateEducation.dto';
import UpdateFamilyDto from 'src/family/dto/updateFamily.dto';
import { Message } from 'src/message/message.entity';
import { UpdatePrefDto } from 'src/preferance/dto/updatePref.dto';
import { updateProfileDto } from 'src/profile/dto/updateProfile.dto';
import User from 'src/users/user.entity';

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Attachment extends Express.Multer.File {}

export type CreateMessageParams = {
  id: string;
  message?: string;
  attachments?: Attachment[];
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type CreateConversationParams = {
  userId: string;
  message: string;
};

export type DeleteMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type FindMesageParmas = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type EditMessageParams = {
  conversationId: string;
  messageId: string;
  userId: string;
  message: string;
};

export type CreateConnectionParams = {
  user: User;
  userId: string;
};

export type ConnectionRequestParams = {
  id: string;
  userId: string;
};

export type CancelConnectionRequestParams = {
  id: string;
  userId: string;
};

export type DeleteConnectionRequestParams = {
  id: string;
  userId: string;
};

export type AcceptConnectionRequestResponse = {
  connection: Connection;
  connectionRequest: ConnectionRequest;
};

export type RemoveFriendEventPayload = {
  connection: Connection;
  userId: string;
};

export type AccessParams = {
  id: string;
  userId: string;
};

export type GetConversationMessagesParams = {
  id: string;
  limit: number;
};

export type UpdateConversationParams = {
  id: string;
  lastMessageSent: Message;
};

export type ConnectionRequestEventPayload = {
  receiver: User;
};

export type ProfileParams = {
  userId: string;
  profileDetail: updateProfileDto;
};

export type FamilyParams = {
  userId: string;
  familyDetail: UpdateFamilyDto;
};

export type PreferanceParams = {
  userId: string;
  preferanceDetail: UpdatePrefDto;
};

export type EducationParams = {
  userId: string;
  educationDetail: UpdateEducationDto;
};
