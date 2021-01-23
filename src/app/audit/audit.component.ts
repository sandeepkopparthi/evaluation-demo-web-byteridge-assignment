import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { LocalDataSource } from 'ng2-smart-table';

@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {

    tableSettings = {
        columns: {
            id: {
                title: 'ID',
                sort: true
            },
            user: {
                title: 'User',
                sort: true
            },
            loginTime: {
                title: 'Login',
                sort: true
            },
            logoutTime: {
                title: 'Logout',
                sort: true
            },
            ip: {
                title: 'IP',
                sort: true
            },
        },
        actions: {
            add: false,
            edit: false,
            delete: false
        }
    };

    tableSource: LocalDataSource;

    audits = [];
    currentUser;
    auditsModified = [];


    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.tableSource = new LocalDataSource();
    }

    ngOnInit() {
        this.loadAllAudits();
    }

    private loadAllAudits() {

        this.auditService.getAll()
            .pipe(first())
            .subscribe((audits) => {
                this.audits = audits;
                for (let i = 0; i < this.audits.length; i++) {

                    let fullDateTimeLogin = this.setDateTimeStructure(this.audits[i].loginTime, false);

                    // let logoutDate = new Date(parseInt(this.audits[i].logoutTime));

                    let fullDateTimeLogout = this.setDateTimeStructure(this.audits[i].logoutTime, false);

                    this.auditsModified.push({
                        user: this.audits[i].user,
                        id: this.audits[i]._id,
                        loginTime: fullDateTimeLogin,
                        logoutTime: fullDateTimeLogout,
                        ip: this.audits[i].ip
                    })
                }
                this.tableSource.load(this.auditsModified);
            });
    }

    setDateTimeStructure(loginLogoutTime: string, is12HourFormat: boolean) {
        let date: Date = new Date(parseInt(loginLogoutTime));
        let DD;
        let MM;
        let YYYY;
        if (date.getDate() < 10) {
            DD = '0' + (date.getDate()).toString();
        }
        else {
            DD = (date.getDate()).toString();
        }
        if (date.getMonth() < 10) {
            if (date.getMonth() !== 9) {
                MM = '0' + (date.getMonth() + 1).toString();
            }
            else {
                MM = (date.getMonth() + 1).toString();
            }

        }
        else {
            MM = (date.getMonth() + 1).toString();
        }
        YYYY = date.getFullYear().toString();

        let hh;
        let mm;
        let ss;

        if (date.getHours() < 10) {
            hh = '0' + date.getHours().toString();
        }
        else {
            if ((is12HourFormat === true) && (date.getHours() > 12)) {
                hh = (date.getHours() - 12).toString();
            }
            else {
                hh = date.getHours().toString();
            }

        }
        if (date.getMinutes() < 10) {
            mm = '0' + date.getMinutes().toString();
        }
        else {
            mm = date.getMinutes().toString();
        }
        if (date.getSeconds() < 10) {
            ss = '0' + date.getSeconds().toString();
        }
        else {
            ss = date.getSeconds().toString();
        }

        return DD + '/' + MM + '/' + YYYY + ' ' + hh + ':' + mm + ':' + ss;
    }

    setTimeStructure(date: Date) {
        let hh;
        let mm;
        let ss;

        if (date.getHours() < 10) {
            hh = '0' + date.getHours();
        }
        else {
            hh = date.getHours();
        }
        if (date.getMinutes() < 10) {
            mm = '0' + date.getMinutes();
        }
        else {
            mm = date.getMinutes();
        }
        if (date.getSeconds() < 10) {
            ss = '0' + date.getSeconds();
        }
        else {
            ss = date.getSeconds();
        }
        return hh + ':' + mm + ':' + ss
    }

    onTimeFormatChange(event) {
        if (event === 12) {
            for (let i = 0; i < this.auditsModified.length; i++) {
                this.auditsModified[i].loginTime = this.setDateTimeStructure(this.auditsModified[i].loginTime, true);
                this.auditsModified[i].logoutTime = this.setDateTimeStructure(this.auditsModified[i].logoutTime, true);
                this.auditsModified.push({
                    user: this.audits[i].user,
                    id: this.audits[i]._id,
                    loginTime: this.auditsModified[i].loginTime,
                    logoutTime: this.auditsModified[i].logoutTime,
                    ip: this.audits[i].ip
                });
            }
        }
        else if (event === 24) {
            for (let i = 0; i < this.auditsModified.length; i++) {
                this.auditsModified[i].loginTime = this.setDateTimeStructure(this.auditsModified[i].loginTime, false);
                this.auditsModified[i].logoutTime = this.setDateTimeStructure(this.auditsModified[i].logoutTime, false);
                this.auditsModified.push({
                    user: this.audits[i].user,
                    id: this.audits[i]._id,
                    loginTime: this.auditsModified[i].loginTime,
                    logoutTime: this.auditsModified[i].logoutTime,
                    ip: this.audits[i].ip
                });
            }
        }
        this.tableSource.load(this.auditsModified);
    }

    onPreviousClick() {
        console.log("previous link clicked");

    }
}