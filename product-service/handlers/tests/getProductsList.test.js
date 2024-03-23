import {describe, expect, test} from '@jest/globals';
import { handler } from '../getProductsList';

describe('getProductsList', () => {
    test('return an array' , async () => {

        const { body } = await handler();
        expect(Array.isArray(JSON.parse(body))).toBeTruthy();
    })

    test('the result array contains objects with expected properties' , async () => {

        const respons = await handler();
        const result = JSON.parse(respons.body);
        result.forEach((item) => {
            expect(item.hasOwnProperty('description')).toBeTruthy();
            expect(item.hasOwnProperty('id')).toBeTruthy();
            expect(item.hasOwnProperty('price')).toBeTruthy();
            expect(item.hasOwnProperty('title')).toBeTruthy();
            expect(item.hasOwnProperty('count')).toBeTruthy();
        })
    })
})
