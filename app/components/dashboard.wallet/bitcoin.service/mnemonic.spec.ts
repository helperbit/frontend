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

import { generateMnemonicPhrase, createMnemonicChallenge, checkMnemonicChallenge, MnemonicChallenge, mnemonicToKeys } from "./mnemonic";

describe('Mnemonic generation, challenge creation and verification', () => {
	let mnemonic: string;
	let mnemonicSplit: string[];
	let challenge: MnemonicChallenge;

	beforeEach(() => {
		mnemonic = generateMnemonicPhrase();
		mnemonicSplit = mnemonic.split(' ');
		expect(mnemonicSplit.length).toBe(12);
		challenge = createMnemonicChallenge(mnemonic);
		expect(challenge.length).toBe(3);
	});

	it('should generate a valid challenge', () => {
		for(const ch of challenge) {
			expect(mnemonic.indexOf(ch.correct) != -1).toBeTrue();
			expect(mnemonicSplit.indexOf(ch.correct) + 1).toBe(ch.index);
		}		
	});

	it('should convert mnemonic to keys', () => {
		expect(mnemonicToKeys(mnemonic)).toBeDefined();
	});

	it('should detect wrong challenge (empty challenge)', () => {
		expect(checkMnemonicChallenge(challenge)).toBeFalse();
	});

	it('should detect wrong challenge (wrong words)', () => {
		challenge[0].insert = challenge[0].correct + 'a';
		challenge[1].insert = challenge[1].correct + 'b';
		challenge[2].insert = challenge[2].correct + 'c';
		expect(checkMnemonicChallenge(challenge)).toBeFalse();
	});

	it('should detect wrong challenge (wrong last word)', () => {
		challenge[0].insert = challenge[0].correct;
		challenge[1].insert = challenge[1].correct;
		challenge[2].insert = challenge[2].correct + 'c';
		expect(checkMnemonicChallenge(challenge)).toBeFalse();
	});

	it('should detect correct challenge', () => {
		challenge[0].insert = challenge[0].correct;
		challenge[1].insert = challenge[1].correct;
		challenge[2].insert = challenge[2].correct;
		expect(checkMnemonicChallenge(challenge)).toBeTrue();
	});
});


describe('BitcoinService', () => {

});