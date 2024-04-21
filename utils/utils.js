import { Counter } from "../models/Counter.js";

export const getNextSequence = async (name) => {
    const ret = await Counter.findOneAndUpdate(
        {_id: name},
        {$inc: { seq: 1 }},
        {new: true, upsert: true}
    );
    return ret.seq;
};