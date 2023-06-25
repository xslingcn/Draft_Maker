/**
 * This service is used to map the uuid to the share code and vice versa. All the share codes
 * are immediately removed after usage.
 * 
 * @property {Map<string, string>} _uuid_to_id_mapping the mapping from uuid to share code.
 * @property {Map<string, string>} _id_to_uuid_mapping the mapping from share code to uuid.
 * 
 * @class
 */
export class ShareCodeMappingService{
    private _uuid_to_id_mapping: Map<string, string>;
    private _id_to_uuid_mapping: Map<string, string>;

    constructor() {
        this._uuid_to_id_mapping = new Map<string, string>();
        this._id_to_uuid_mapping = new Map<string, string>();
    }

    /**
     * Adds the uuid to the mapping and generate a share code for it.
     * @param uuid the uuid to be added.
     * @returns {string} the share code generated.
     */
    add(uuid: string): string { 
        let id = this._uuid_to_id_mapping.get(uuid);
        if(!id) { 
            id = this.generateId();
            this._uuid_to_id_mapping.set(uuid, id);
            this._id_to_uuid_mapping.set(id, uuid);
        }
        return id;
    }

    /**
     * Gets the uuid from the share code.
     * @param id the id to be searched.
     * @returns {string | undefined} the uuid if found, undefined otherwise.
     */
    getUuid(id: string): string | undefined { 
        return this._id_to_uuid_mapping.get(id);
    }

    /**
     * Gets the share code from the uuid.
     * @param uuid the uuid to be searched.
     * @returns {string | undefined} the share code if found, undefined otherwise.
     */
    getId(uuid: string): string | undefined { 
        return this._uuid_to_id_mapping.get(uuid);
    }

    /**
     * Removes the uuid from the mapping.
     * @param uuid the uuid to be removed.
     * @modify this
     * @effects this is modified to remove the uuid.
     */
    remove(uuid: string) { 
        const id = this._uuid_to_id_mapping.get(uuid);
        if(id) { 
            this._uuid_to_id_mapping.delete(uuid);
            this._id_to_uuid_mapping.delete(id);
        }
    }

    /**
     * Generates a random 6-digit number that is not in the mapping.
     * @returns {string} the generated id.
     */
    private generateId(): string {
        let id = '';
        while (id.length < 6 || this._id_to_uuid_mapping.has(id)) {
            id = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        }
        return id;
    }
}

const shareCodeMapping = new ShareCodeMappingService();
export default shareCodeMapping;