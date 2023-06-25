import { v4 as uuidv4 } from 'uuid';
import FailRequestError from '../../errors/fail.error';

/**
 * This class provides specific internal operations on Draft object.
 */
class Draft implements Draft{
    /**
     * The unique id of the draft.
     */
    uuid: string;
    /**
     * The name of the draft.
     */
    name: string;
    /**
     * The list of items to be picked.
     */
    items: string[];
    /**
     * The number of rounds.
     */
    rounds: number;
    /**
     * The list of users.
     */
    users: string[];
    /**
     * The list of records of picks.
     */
    picks: { item: string; user: string; }[];
    /**
     * The current round number.
     */
    currRound: number;
    /**
     * The current user index in the users array.
     */
    currUserIndex: number;
    /**
     * The name of the current user.
     */
    currUser: string;
    /**
     * Whether the draft is completed.
     */
    completed: boolean;

    constructor(name:string, items: string[], rounds: number, users: string[]) {
        this.uuid = uuidv4();
        this.name = name;
        this.items = items;
        this.rounds = rounds;
        this.users = users;
        this.picks = [];
        this.currRound = 0;
        this.currUserIndex = 0;
        this.currUser = users[0];
        this.completed = false;
    }

    /**
     * Gets whether a user can put picks in this draft.
     * @param user the user to be checked.
     * @returns {boolean} true if the user can put picks in this draft, false otherwise.
     */
    join(user: string) { 
        return this.users.includes(user);
    }

    /**
     * Lets the user pick the item in the draft.
     * @param user the user that's to pick the item.
     * @param item the item that's to be picked.
     * @modify this
     * @effects the item is removed from the draft, and the draft is updated such that draft.picks include
     * the record of the pick. Also the currUser and currRound are pushed by 1.
     * @throws {FailRequestError} if the user is not in the draft, or it is not the user's turn, or the item is not in 
     * the draft.
     */
    pick(user: string, item: string) {
        if (!this.users.includes(user)) {
            throw new FailRequestError(`User ${user} not exists`);
        }
        if (this.currUser !== user) {
            throw new FailRequestError(`It is not ${user}'s turn`);
        }
        if (!this.items.includes(item)) {
            throw new FailRequestError(`Item ${item} not exists`);
        }
        this.picks.push({ item, user });
        this.items = this.items.filter(i => i !== item);
        this.next();
    }

    /**
     * Increments the currUser and currRound by 1, update round number and check whether the draft is completed.
     * If is, set `this.completed` to true.
     */
    next() {
        if (this.items.length === 0) { 
            this.completed = true;
            return;
        }

        this.currUserIndex += 1;
        if (this.currUserIndex >= this.users.length) {
            this.currRound += 1;
            if (this.currRound >= this.rounds) {
                this.completed = true;
                return;
            }
            this.currUserIndex = 0;
        }
        this.currUser = this.users[this.currUserIndex];
    }


    /**
     * Gets whether the draft is completed.
     * @returns {boolean} true if the draft is completed, false otherwise.
     */
    isComplete() {
        return this.completed;
    }
}

export default Draft;