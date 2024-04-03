/** The enumerated status of the feedback  */
export type FeedbackStatus = 'idle' | 'busy' | 'success' | 'error';

/** The feedback object */
export type Feedback = { status: FeedbackStatus; message: string };

/** The initial feedback object */
export const NULL_FEEDBACK: Feedback = { status: 'idle', message: '' };
