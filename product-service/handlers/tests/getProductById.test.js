import {describe, expect, test} from '@jest/globals';
import { handler } from '../getProductById';

const mockId = '7567ec4b-b10c-48c5-9345-fc73c48a80a3';

describe('getProductById', () => {
    test('find product by id' , async () => {
        const event = { pathParameters: { productId: mockId } }

        const { body } = await handler(event);
        expect(JSON.parse(body).title).toBe('Product');
    })
})
