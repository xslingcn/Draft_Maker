import Joi from 'joi';

/**
 * The validation schema for the URL param for /draft/:draftId endpoint.
 */
export interface DraftIdURLParams{
    draftId: string;
}

export const draftIdURLParamsSchema = Joi.object({
    draftId: Joi.string().required()
});

/**
 * The validation schema for the POST body for /draft/:draftId/pick endpoint.
 */
export interface PickItemParams { 
    draftId: string;
    user: string;
    item: string;
}

export const pickItemPostBodySchema = Joi.object({
    user: Joi.string().required(),
    item: Joi.string().required()
});