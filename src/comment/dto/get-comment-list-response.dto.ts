import { CommentEntity } from '../comment.entity';
import { GetCommentListElementDTO } from './get-comment-list-element.dto';

export class GetCommentListResponseDTO {
  public constructor(comments: CommentEntity[]) {
    this.count = comments.length;
    this.data = comments.map(comment => new GetCommentListElementDTO(comment));
  }
  public readonly count: number;
  public readonly data: object;
}
