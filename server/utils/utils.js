import { Counter } from "../models/Counter.js";
/**
 * Increments and retrieves the next sequence number for a given sequence name.
 * This is useful for auto-incrementing values like order numbers or IDs.
 * @param {string} name - The identifier for the sequence.
 * @returns {Promise<number>} The next sequence number.
 */
export const getNextSequence = async (name) => {
    const ret = await Counter.findOneAndUpdate(
        {_id: name},
        {$inc: { seq: 1 }},
        {new: true, upsert: true}
    );
    return ret.seq;
};