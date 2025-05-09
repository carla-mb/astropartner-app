export class PostDTO {
  postId?: string; 
  userId?: string; 
  username?: string;
  postTitle: string; 
  postContent: string; 
  postDate: Date; 

  constructor(
    postTitle: string, 
    postContent: string, 
    postDate: Date
  ) {
    this.postTitle = postTitle;
    this.postContent = postContent;
    this.postDate = postDate;
  }
}
