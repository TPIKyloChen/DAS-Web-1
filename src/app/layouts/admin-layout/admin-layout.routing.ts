import { Routes } from '@angular/router';

import {DatasetComponent} from "../../dataset/dataset.component";
import {DatasetEditComponent} from "../../dataset-edit/dataset-edit.component";
import {AgentComponent} from "../../agent/agent.component";
import {ModelComponent} from "../../model/model.component";
import {PromptComponent} from "../../prompt/prompt.component";
import {ChatNewComponent} from "../../chat-new/chat-new.component";
import {IndexComponent} from "../../index/index.component";
import { ChatComponent } from "../../chat/chat.component";
import {ImageComponent} from "../../image/image.component";
import { ChatConverseComponent } from "../../chat-converse/chat-converse.component";

export const AdminLayoutRoutes: Routes = [
    { path: 'chat',      component: ChatComponent },
    { path: 'agent',      component: AgentComponent },
    { path: 'model',   component: ModelComponent },
    { path: 'dataset',     component: DatasetComponent },
    { path: 'prompt',     component: PromptComponent },
    { path: 'image',     component: ImageComponent },
    { path: 'dataset-edit/:uuid/:name',     component: DatasetEditComponent },
    { path: 'chat-new/:agentUuid/:name',     component: ChatNewComponent },
    { path: 'chat/:chatUuid/:name',     component: ChatConverseComponent },
    { path: '',     component: IndexComponent },
];
