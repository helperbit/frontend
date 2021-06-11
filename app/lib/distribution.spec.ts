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

import Distribution from './distribution';
import { EventAffectedUsers } from 'app/models/event';
import AppSettings from 'app/app.settings';

const empty: EventAffectedUsers = {
    company: [],
    singleuser: [],
    npo: [],
    projects: [],
    geoquads: { count: 0, min: 0, max: 0, features: [] },
};

const easy: EventAffectedUsers = {
    "company": [
        {
            "received": 0.00165425,
            "trustlevel": 1,
            "username": "twnu12",
            usertype: 'company',
            subtype: 'none',
            banned: false,
            avatar: null,
            receiveaddress: '',
            _id: '',
            location: { type: "Point", coordinates: [] },
        }
    ],
    "singleuser": [],
    npo: [],
    "projects": [],
    "geoquads": { count: 0, min: 0, max: 0, features: [] }
};
const normal: EventAffectedUsers = {
    "geoquads": { count: 0, min: 0, max: 0, features: [] },
    "company": [
        {
            "received": 0.00165425,
            "trustlevel": 1,
            "username": "twnu12",
            usertype: 'company',
            subtype: 'none',
            banned: false,
            avatar: null,
            receiveaddress: '',
            _id: '',
            location: { type: "Point", coordinates: [] },
        }
    ],
    "projects": [],
    "npo": [
        {
            "received": 0,
            "trustlevel": 1,
            "username": "twnu16",
            usertype: 'company',
            subtype: 'none',
            banned: false,
            avatar: null,
            receiveaddress: '',
            _id: '',
            location: { type: "Point", coordinates: [] },
        },
        {
            "received": 0,
            "trustlevel": 1,
            "username": "twnu17",
            usertype: 'company',
            subtype: 'none',
            banned: false,
            avatar: null,
            receiveaddress: '',
            _id: '',
            location: { type: "Point", coordinates: [] },
        }
    ],
    "singleuser": [
        {
            "received": 0,
            "trustlevel": 1,
            "username": "gianni",
            usertype: 'company',
            subtype: 'none',
            banned: false,
            avatar: null,
            receiveaddress: '',
            _id: '',
            location: { type: "Point", coordinates: [] },
        },
        {
            "received": 0.00060358,
            "trustlevel": 1,
            "username": "twnu15",
            usertype: 'company',
            subtype: 'none',
            banned: false,
            avatar: null,
            receiveaddress: '',
            _id: '',
            location: { type: "Point", coordinates: [] },
        }
    ]
};

describe("Distribution", () => {
    it('should checks on empty distribution', () => {
        const dist = new Distribution(empty, 1, 100, AppSettings.userTypes, AppSettings.minDonation);
        expect(dist).toBeDefined();

        expect(dist.nUsers()).toEqual(0);
        // expect(dist.toFormatted()).toEqual({helperbit: '0.05000000'});
    });


    describe("Enable/disable user", () => {

    })

    describe("Lock/unlock", () => {

    })

    describe("Priority", () => {
    })

});

// describe("Groups redistribution", () => {    
//     it("should distribute exactly 100 share", () => {
//         const dist = new Distribution(normal, 1, 0, AppSettings.userTypes, AppSettings.minDonation);
//         const totalShares = dist.distribution.reduce((tot, userType) => tot += userType.distribution, 0);
//         expect(totalShares).toEqual(100);
//     });

//     it("should not distribute anything to empty group", () => {
//         const dist = new Distribution(normal, 1, 0, AppSettings.userTypes, AppSettings.minDonation);
//         expect(dist.distributionMap['munic'].distribution).toEqual(0);
//     });

//     it("should update single group percentage", () => {
//         const dist = new Distribution(normal, 1, 0, AppSettings.userTypes, AppSettings.minDonation);
//         expect(dist.distributionMap['civilprotection'].distribution).not.toEqual(0);
//         dist.updatePercentage('civilprotection', 20);
//         expect(dist.distributionMap['civilprotection'].distribution).toEqual(20);
//     })

//     it("should distribute exactly 100 share after manual updatePercentage", () => {
//         const dist = new Distribution(normal, 1, 0, AppSettings.userTypes, AppSettings.minDonation);
//         const totalShares = dist.distribution.reduce((tot, userType) => tot += userType.distribution, 0);
//         expect(totalShares).toEqual(100);
//     });
// });

// describe("Enable/disable group", () => {
//     it("should not distribute to disabled group", () => {
//         expect(dist.distributionMap['civilprotection'].distribution).not.toEqual(0);
//         dist.updateCheck('civilprotection', false);
//         expect(dist.distributionMap['civilprotection'].distribution).toEqual(0);
//     })

//     it("should distribute exactly 100 after group disabled", () => {
//         const totalShares = dist.distribution.reduce((tot, userType) => tot += userType.distribution, 0);
//         expect(totalShares).toEqual(100);
//     })

//     it("should not update disabled group", () => {
//         dist.updatePercentage('civilprotection', 10);
//         expect(dist.distributionMap['civilprotection'].distribution).toEqual(0);
//     })
// })

// describe("Amount", () => {
//     it("should distribute the whole amount", () => {
//         dist.updateAmount(100);
//         let totalDistributedAmount = dist.distribution.reduce((tot, userType) => {
//             const localDistribution = userType.users.reduce((tot, user) => tot += user.donation, 0)
//             return tot += localDistribution;
//         }, 0);
//         expect(totalDistributedAmount).toEqual(100);
//     })

//     it("shoud distribute the whole amount on amount change", () => {
//         dist.updateAmount(200);
//         totalDistributedAmount = dist.distribution.reduce((tot, userType) => {
//             const localDistribution = userType.users.reduce((tot, user) => tot += user.donation, 0)
//             return tot += localDistribution;
//         }, 0);
//         expect(totalDistributedAmount).toEqual(200);
//     })


//     it("should correctly distribute between groups", () => {
//         // qui ci sono solo due user, uno in civilprotection e uno in hospital
//         dist = new Distribution(easy, { debug: true, minDonation: 1 });

//         dist.updatePercentage('hospital', 30);
//         expect(dist.distributionMap['hospital'].distribution).toEqual(30);
//         expect(dist.distributionMap['civilprotection'].distribution).toEqual(70);

//         dist.updatePercentage('hospital', 50);
//         expect(dist.distributionMap['hospital'].distribution).toEqual(50);
//         expect(dist.distributionMap['civilprotection'].distribution).toEqual(50);
//     })

//     it("should correcly distribute amount per user", () => {
//         dist.updateAmount(20);
//         const hospitalAmount = dist.distributionMap['hospital'].users.reduce((tot, user) => tot += user.donation, 0);
//         expect(hospitalAmount).toEqual(10);
//     })
// });
