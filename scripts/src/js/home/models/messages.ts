export type SocketReqMessage = {
    type: string;
    method: string;
    params?: any;
    id?: number;
};

export type SocketResMessage = {
    type: string;
    method: string;
    result?: any;
    error?: any;
    id?: any;
};
