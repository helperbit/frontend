/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

/**
 * Sostanzialmente ho un `amount` da distribuire tra vari utenti.
 *
 * Posso farlo solo se ci sono degli utenti a cui distribuirlo.
 *
 * Gli utenti a cui poterlo distribuire sono di varie tipologie (singleuser, school, npo... etc)
 * e per ognuna di queste ho una percentuale di redistribuzione  modificabile
 * dall'utente e con un default iniziale (quando l'utente modifica la distribuzione
 * di un gruppo, gli altri devono variare in modo che la somma della distribuzione
 * sia sempre 100%).
 *
 * L'utente ha la possibilita' di mettere un lock alla distribuzione di un gruppo.
 * per non farla variare al variare di quella di altri gruppi. (corner case:
 * se solo un gruppo non e' locked automaticamente non lo fa modificare)
 *
 * La donazione per singolo utente ha un minimo, quindi ho un massimo di benefattori => amount/minDonation
 *
 * Quindi per ogni gruppo, dato un amount da donare, lo divido per la distribution
 * del gruppo e ottenengo l'amount da redistribuire agli utenti di quel gruppo.
 *
 * se questo amount per utente e' minore della donazione minima devo scegliere
 * meno utenti di quelli disponibili, come li scelgo?
 * hanno piu' priorita' nel ricevere gli utenti che hanno ricevuto menu,
 * gli utenti con piu' trustlevel e quelli piu' vicini all'epicentro.
 * a parita' di tutto questo, pesco a caso.
 *
 * l'utente ha la possibilita' di selezionare un trustlevel minimo (per il gruppo singleuser)
 *
 * nel caso in cui non ci siano utenti in un gruppo lo disabilito (anche al cambiare dei parametri
 * dinamici, ad esempio se l'utente cambia il trustlevel minimo alzandolo sopra quello di tutti gli
 * utenti, bisognera' disabilitare il gruppo singleuser e rifare tutta la distribution)
 */
import inside from '@turf/boolean-point-in-polygon';
import disjoint from '@turf/boolean-disjoint';
import combine from '@turf/combine';

export type ObjectId = string;

export type Point = {
	type: string;
	coordinates: number[];
};

export interface EventAffectedUser {
	location: Point;
	usertype: string;
	subtype: string;
	banned: boolean;
	trustlevel: number;
	avatar: string;
	received: number;
	receiveaddress: string;
	_id: ObjectId;
	username: string;
}

export interface EventAffectedProject {
	media: string[];
	target: number;
	owner: string;
	currency: string;
	received: number;
	pending: number;
	used: number;
	_id: ObjectId;
}


export interface EventAffectedUsers {
	geoquads: {
		count: number;
		min: number;
		max: number;
		features: {};
	};
	singleuser: EventAffectedUser[];
	npo: EventAffectedUser[];
	company: EventAffectedUser[];
	projects: EventAffectedProject[];

}

export default class Distribution {
    affected: any;
    donation: any;
    trustlevel: number;
    amount: number;
    destinationusers: number;
    distribution: any[];
    distributionMap: any;

    constructor(affected: EventAffectedUsers, amount: number | string, trustlevel: number, private userTypes, private minDonation: number) {
        this.affected = affected;
        this.donation = { users: {} };
        this.trustlevel = trustlevel || 100;
        if (typeof (amount) == 'string')
            this.amount = Number(parseFloat(amount).toFixed(8));
        else
            this.amount = amount;
        this.destinationusers = 0;

        this.distribution = [];
        this.distributionMap = {};

        // seleziono gli ownser dei progetti perche' li devo disabilitare
        let owners = affected.projects.map(p => p.owner);

        // inizializzo la distribuzione per ogni tipo di utente
        this.userTypes.forEach(userType => {
            // numero di "utenti" di questo tipo coinvolti
            let localAffectedUsers = affected[userType.code] ? affected[userType.code].length : 0;

            let distribution = {
                userType: userType.code,
                users: [],
                usersMap: {},
                basedistribution: userType.basedistribution,
                // se non ci sono affected user in questo gruppo, disabilito
                enabled: localAffectedUsers > 0 || userType.code === 'helperbit',
                // come sopra per la distribuzione..
                distribution: localAffectedUsers > 0 || userType.code === 'helperbit' ? userType.basedistribution : 0,
                // nel caso helperbit la distribuzione e' locked
                locked: userType.code === 'helperbit',
                usernumber: 0
            };

            if (localAffectedUsers) {
                // filtro gli owner dei progetti di questo evento
                affected[userType.code] = affected[userType.code].filter(user => owners.indexOf(user.username) === -1)
                distribution.users = affected[userType.code].map(user => {
                    let u = {
                        username: user.username || user._id,
                        address: user.address,
                        trustlevel: user.trustlevel,
                        received: user.received,
                        enabled: (userType.code !== 'singleuser' || user.trustlevel >= trustlevel),
                        type: userType.code,
                        owner: user.owner || '',
                        donation: 0
                    }
                    distribution.usersMap[u.username] = u;
                    return u
                }).sort(this._sortUsers);
            }

            this.distributionMap[userType.code] = distribution;
            this.distribution.push(distribution);
        })

        // ricalcolo le distribution
        this.update();

        // hb locked di default
        this.distributionMap.helperbit.locked = true;
    }

    _sortUsers(a, b) {
        // se uno degli utenti e' disabilitato viene dopo
        if (a.enabled && !b.enabled) return -1;
        if (!a.enabled && b.enabled) return 1;

        // ha priorita' chi ha ricevuto di meno
        let deltaReceived = a.received - b.received;

        // se hanno ricevuto la stessa cifra,
        // li ordino per trustlevel (nel caso siano singleuser)
        if (deltaReceived === 0 && a.type === 'singleuser') {
            return a.trustlevel - b.trustlevel;
        } else {
            return deltaReceived;
        }
    }

    _calculateAmountPerType(userType: string) {
        const groupDistribution = this.distributionMap[userType];
        if (!groupDistribution.enabled || userType === 'helperbit') return;

        // se non c'e' distribution per questo gruppo
        // azzero la distribution per i suoi utenti
        if (groupDistribution.distribution == 0) {
            groupDistribution.users.forEach(user => {
                user.donation = 0;
                // user.enabled = false;
            })
            return;
        }

        // quanto e' l'amount da distribuire tra gli utenti di questo gruppo
        const groupAmount = this.amount / 100 * groupDistribution.distribution;

        // numero di potenziali riceventi
        let nBenefactors = Math.floor(groupAmount / this.minDonation);
        if (nBenefactors === 0 && groupAmount > 0) nBenefactors = 1;

        groupDistribution.users.forEach(user => user.donation = 0);

        // seleziono gli utenti abilitati di questo gruppo
        const enabledUsers = groupDistribution.users.filter(user => user.enabled);
        enabledUsers.sort(this._sortUsers);

        // se non ci sono utenti abilitati in questo gruppo, lo disabilito e ricalcolo la redistribuzione
        // anche per gli altri gruppi
        if (enabledUsers.length === 0) {
            groupDistribution.enabled = false;
            if (groupDistribution.distribution !== 0) {
                groupDistribution.distribution = 0;
                groupDistribution.usernumber = 0;
                this.update(userType);
            }
            return;
        }

        // se il numero di potenziali riceventi e' >= del numero degli utenti abilitati..
        // divido in parti uguali
        let amountPerUser = 0;
        if (nBenefactors >= enabledUsers.length) {
            amountPerUser = groupAmount / enabledUsers.length;
            groupDistribution.usernumber = enabledUsers.length;
            enabledUsers.forEach(user => user.donation = amountPerUser.toFixed(8));
        }
        // altrimenti prendo i primi nBenefactors (sono gia' ordinati per priorita')
        else {
            amountPerUser = groupAmount / nBenefactors;
            groupDistribution.usernumber = nBenefactors;
            enabledUsers.slice(0, nBenefactors).forEach(user => user.donation = amountPerUser.toFixed(8));
        }

        // groupDistribution.users.forEach( user => {
        //     user.enabled = (user.donation > 0);
        // })

    }

    /**
     * calcolo la distribution per ogni gruppo
     * @param  String keep   un gruppo di cui non modificare la distribution perche' appena cambiato manualmente
     */
    _calculateDistribution(keepType: string = null) {
        // conto la distribuzione totale in questo momento
        // non considerando i gruppi disabilitati
        let totalDistribution = 0;
        let totalBaseDistribution = 0;
        this.distribution.forEach(userType => {
            if (!userType.enabled) userType.distribution = 0;
            totalDistribution += userType.distribution;
        });

        // se siamo a 100, tutto e' bellissimo e non faccio nulla
        if (totalDistribution === 100) return;


        // gruppi di cui posso modificare la distribution (enabled && !locked)
        let availableUserTypes = this.distribution.filter(userType => {
            const available = userType.userType != keepType && userType.enabled && !userType.locked;
            if (available)
                totalBaseDistribution += userType.basedistribution;
            return available;
        });

        // altrimenti devo redistribuire il rimanente tra gli available
        // proporzionalmente a quanto gia' hanno
        let diff = 100 - totalDistribution;

        // se non ci sono available, il keep vince se e' enabled
        if (availableUserTypes.length === 0) {
            if (keepType && this.distributionMap[keepType].enabled) {
                this.distributionMap[keepType].distribution += diff;
            }
            else {
                // disabilito la donazione !
                console.error('TODO: DISABLE DONATION! NO AVAILABLE USERS TO DONATE TO.')
            }
            return;
        }

        let redistributed = 0;
        let error = false;
        availableUserTypes.find(userType => {
            if (userType.userType === 'helperbit') return;
            const groupAmount = Math.floor(diff / totalBaseDistribution * userType.basedistribution);
            // diff -= groupAmount;
            if (userType.distribution + groupAmount <= 100 && userType.distribution + groupAmount >= 0) {
                redistributed += groupAmount
                userType.distribution += groupAmount;
            } else {
                error = true;
                return true;
            }
        })

        diff -= redistributed;
        if (error) {
            if (keepType && this.distributionMap[keepType].enabled)
                this.distributionMap[keepType].distribution += diff;
            return;
        }

        if (diff === 0) return;

        // il rimanente lo aggiungo ad un gruppo a caso ma con proporzionalita'
        const dice = Math.floor(Math.random() * totalBaseDistribution);
        let index = 0;
        availableUserTypes.find(userType => {
            index += userType.basedistribution;
            if (dice < index) {
                userType.distribution += diff;
                return true;
            }
        })

    }

    /* Update the distribution; called with default parameters, will return the default distribution */
    update(keepType: string = null) {
        this._calculateDistribution(keepType);
        this.userTypes.forEach(userType => this._calculateAmountPerType(userType.code));
    }

    /* Update the amount to distribute */
    updateAmount(amount: number | string) {
        if (typeof(amount) == 'string')
            this.amount = Number(parseFloat(amount).toFixed(8));
        else
            this.amount = amount;
        this.userTypes.forEach(userType => this._calculateAmountPerType(userType.code));
    }

    /* Update the minimum trustlevel for single users */
    updateTrustlevel(level: number) {
        this.trustlevel = level;
        this.distributionMap['singleuser'].users.forEach(user => {
            user.enabled = (user.trustlevel >= level);
            if (!user.enabled)
                user.donation = 0;
        });
        let enabledUsers = this.distributionMap['singleuser'].users.filter(user => user.enabled);
        if (!enabledUsers.length) {
            this.distributionMap['singleuser'].enabled = false;
            this.distributionMap['singleuser'].distribution = 0;
            this.distributionMap['singleuser'].usernumber = 0;
            this.update('singleuser')
        } else {
            if (!this.distributionMap['singleuser'].enabled) {
                this.distributionMap['singleuser'].enabled = true;
                this.update()
            } else {
                this._calculateAmountPerType('singleuser');
            }
        }
    }

    /* Modify the lock status of an usertype */
    updateLock(usertype: string, lockstatus: boolean) {
        this.distributionMap[usertype].locked = lockstatus;
    }

    updateUserCheck(usertype: string, username: string, checkstatus: boolean, checkTrustlevel: boolean = false) {
        const user = this.distributionMap[usertype].usersMap[username]
        if (!user) return
        if (checkstatus && checkTrustlevel && usertype === 'singleuser') {
            user.enabled = (usertype != 'singleuser' || user.trustlevel >= this.trustlevel);
        } else {
            user.enabled = checkstatus;
        }

        if (!checkstatus) {
            // se e' false azzero la donazione di questo utente
            this.distributionMap[usertype].usersMap[username].donation = 0;
            // controllo se ci sono altri utenti in questo gruppo altrimenti
            // disabilito il gruppo
            let enabledUsers = this.distributionMap[usertype].users.filter(user => user.enabled)
            if (!enabledUsers.length) {
                this.distributionMap[usertype].enabled = false;
                this.distributionMap[usertype].distribution = 0;
                this.distributionMap[usertype].usernumber = 0;
            }
        } else {
            this.distributionMap[usertype].enabled = true;
        }
    }

    /* Modify the enabler for an usertype */
    updateCheck(usertype: string, checkstatus: boolean) {
        this.distributionMap[usertype].enabled = checkstatus;
        this.distributionMap[usertype].users.forEach(user => {
            if (checkstatus && usertype === 'singleuser') {
                user.enabled = user.trustlevel >= this.trustlevel;
            } else {
                user.enabled = checkstatus;
            }
        });
        if (!checkstatus) {
            this.distributionMap[usertype].users.forEach(user => user.donation = 0);
            this.distributionMap[usertype].distribution = 0;
            this.distributionMap[usertype].usernumber = 0;
        }
    }

    /* Modify the percentage of an usertype */
    updatePercentage(usertype: string, newvalue: number) {
        this.distributionMap[usertype].distribution = newvalue;
        // update percentage of other groups
        this.update(usertype);
    }

    updateShakemap(shakemaps, points = null) {
        // single user
        this.affected.geoquads.features.forEach(geoquad => {
            if (!disjoint(geoquad, shakemaps) && shakemaps.features.length > 0)
                geoquad.properties.idlist.forEach(username => this.updateUserCheck('singleuser', username, true, true));
            else
                geoquad.properties.idlist.forEach(username => this.updateUserCheck('singleuser', username, false, true));
        })

        // others usertype (points already initialized in advanced donation)
        if (!points) {
            points = { "type": "FeatureCollection", "features": [] };
            this.userTypes.forEach(userType => {
                const code = userType.code;
                if (code == 'helperbit' || code == 'singleuser' || code == 'projects') return;
                points.features = points.features.concat(this.affected[code].map(user => ({
                    type: "Feature", properties: { n: user.username, t: code }, geometry: user.location
                })))
            })
        }

        shakemaps = combine(shakemaps)
        points.features.forEach(f => {
            const i = inside(f, shakemaps.features[0])
            this.updateUserCheck(f.properties.t, f.properties.n, i, true)
        })

    }

    nUsers(): number {
        return this.destinationusers
    }

    /* Transform the distribution to an object for donation/event/:eid/create api */
    toFormatted(): { [user: string]: number } {
        let formatted = {}
        this.destinationusers = 0
        this.distribution
            .map(userType => userType.users) // prendo gli users di ogni gruppo
            .reduce((users, user) => users.concat(user), []) //li concateno in un solo array
            .filter(user => user.donation) // di cui seleziono solo i destinatari
            // e li metto nei formatted
            .forEach(user => {
                this.destinationusers++
                if (user.type === 'projects') {
                    formatted[user.owner] = user.donation
                }
                else
                    formatted[user.username] = user.donation
            })

        formatted['helperbit'] = (this.distributionMap['helperbit'].distribution * this.amount / 100.0).toFixed(8)
        return formatted
    }
}
