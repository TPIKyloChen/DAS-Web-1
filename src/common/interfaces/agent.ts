import {Model} from "./model";
import {Prompt} from "./prompt";
import {Dataset} from "./dataset";

export interface Agent {
    uuid: string;
    name: string;
    model: Model;
    prompt: Prompt;
    dataset: Dataset;
}
