export class CommentDTO {
  commentId?: string; 
  postId?: string;
  userId?: string; 
  username?: string;
  commentContent: string; 
  commentDate: Date; 

  constructor(
    commentContent: string, 
    commentDate: Date
  ) {
    this.commentContent = commentContent;
    this.commentDate = commentDate;
  }
}