import { Component, OnInit } from '@angular/core';
import {TranslationsService} from '../../services/translations/translations.service';

@Component({
  selector: 'app-project-selector-menu',
  templateUrl: './project-selector-menu.component.html',
  styleUrls: ['./project-selector-menu.component.scss']
})
export class ProjectSelectorMenuComponent implements OnInit {

  constructor(
    public translationsService: TranslationsService
  ) { }

  ngOnInit() {
  }

  openProject(project) {
    this.translationsService.openProjectFromCollection(project.name);
  }
}
