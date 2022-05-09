/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
export class Message {
    id: string;
    text: string;
    created: Date;
    writer: number;
    type: MessageType;
}

export enum MessageType {
    text = 'text',
    give = 'give',
    accepted = 'accepted',
    refused = 'refused',
    close = 'close'
}
