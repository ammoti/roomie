export class UserQuestion {
  userid: number;
  questionid: number;
  answer: boolean;
  constructor(userid?: number, questionid?: number, answer?: boolean) {
    this.userid = userid;
    this.questionid = questionid;
    this.answer = answer;
  }
}
