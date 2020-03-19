import { Injectable } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

export interface ModalInfo {
    acceptText?: string;
    declineText?: string;
    title?: string;
    message?: string;
    onAccept?: VoidFunction;
}

export var ModalTemplates: Map<string, ModalInfo> = new Map([
    ['info', { acceptText: 'Ok', title: 'Information'}],
    ['sureSave', { acceptText: 'Save', declineText: 'Cancel', title: 'Warning', message: 'Are sure want to save?'}],
    ['sureDelete', { acceptText: 'Delete', declineText: 'Cancel', title: 'Warning', message: 'Are sure want to delete?'}],
]);

@Injectable()
export class ModalService{

  constructor(private ngxSmartModalService: NgxSmartModalService) {
  }

  public openInfoModal(templateID: string, info?: ModalInfo) {
    this.open('infoModal', templateID, info);
  }

  public closeInfoModal() {
    this.close('infoModal');
  }

  public open(modalID: string, templateID: string, info?: ModalInfo) {
    let modal = this.ngxSmartModalService.getModal(modalID);
    const data = {...ModalTemplates.get(templateID), ...info || {} };
    modal.setData(data, true);
    modal.open();
  }

  public close(modalID: string) {
    this.ngxSmartModalService.getModal(modalID).close();
  }
}

