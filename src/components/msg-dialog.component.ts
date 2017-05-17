import { Subscription } from 'rxjs/Rx';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, EventEmitter, Output, Input } from '@angular/core';

export class MsgDialogSettings {
    public title: string;
    public message: string;
    public okText?: string;
    public cancelText?: string;
    public showCancelButton?: boolean;
    public onOK?: () => void;
    public onCancel?: () => void;
}

@Component({
    selector: 'msg-dialog',
    templateUrl: './msg-dialog.html',
    styleUrls: ['./msg-dialog.css']
})
export class MsgDialog implements OnInit {
    @Output("msgDialogLoaded") msgDialogLoaded = new EventEmitter<MsgDialog>();
    @ViewChild('msgDialogModal') msgDialogModal: ModalDirective;

    private modalSubscriptions: Subscription[] = [];
    private settings: MsgDialogSettings;

    constructor(private resolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.msgDialogLoaded.emit(this);
    }

    public showModal(settings: MsgDialogSettings) {
        this.settings = settings;
        this.msgDialogModal.show();
    }

    public hideModal() {
        this.msgDialogModal.hide();
    }

    public onShown(action: () => void) {
        this.modalSubscriptions.push(this.msgDialogModal.onShown.subscribe(action));
    }

    public onHidden(action: () => void) {
        this.modalSubscriptions.push(this.msgDialogModal.onHidden.subscribe(() => {
            action();
            this.clearSubscriptions();
        }));
    }

    private clearSubscriptions() {
        this.modalSubscriptions.map(sub => { sub.unsubscribe(); });
        this.modalSubscriptions = [];
    }

    private onOkEvent(): void {
        this.hideModal();
        if (this.settings && this.settings.onOK) {
            this.settings.onOK();
        }
    }

    private onCancelEvent(): void {
        this.hideModal();
        if (this.settings && this.settings.showCancelButton && this.settings.onCancel) {
            this.settings.onCancel();
        }
    }
}