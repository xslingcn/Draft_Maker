import dao from "../../../models/daoFactory"
import Draft from "../../../models/entity/draft.entity";


export const pushRandomDraft = async (): Promise<Draft> => {
    const draft = await randomDraft();
    await dao.drafts.add(draft);
    return draft;
}

export const randomDraft = async (): Promise<Draft> => { 
    const name = generateRandomString();
    let items: string[] = [];
    const itemsLength = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < itemsLength; i++) {
        items.push(generateRandomString());
    }
    const rounds = Math.floor(Math.random() * 10) + 1;
    let users: string[] = [];
    const usersLength = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < usersLength; i++) {
        users.push(generateRandomString());
    }
    return new Draft(name, items, rounds, users);
}

export const clearDraftsTest = async () => { 
    await dao.drafts.getAll()
        .then(drafts => Promise.all(drafts.map(draft => dao.draft.remove(draft.uuid))));
}

function generateRandomString() {
    const length = Math.floor(Math.random() * 10) + 1;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



