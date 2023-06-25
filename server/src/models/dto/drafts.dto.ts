import Joi from 'joi';

/**
 * The validation schema for the POST body for /draft/new endpoint.
 */
export interface NewDraftPostBody { 
    name: string;
    items: string[];
    rounds: number;
    users: string[];
}

export const newDraftPostBodySchema = Joi.object({
    name: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
    rounds: Joi.number().required(),
    users: Joi.array().items(Joi.string()).required()
});

/**
 * The validation schema for the POST body for /draft/join endpoint.
 */
export interface JoinDraftPostBody {
    shareCode: string;
    user: string;
}

export const joinDraftPostBodySchema = Joi.object({
    shareCode: Joi.string().required(),
    user: Joi.string().required()
});