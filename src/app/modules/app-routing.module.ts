import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TranslationViewComponent} from '../views/translation-view/translation-view.component';

const routes: Routes = [
    {
        path: '',
        component: TranslationViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
