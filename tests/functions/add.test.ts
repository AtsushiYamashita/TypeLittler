import { sum, append } from "#/functions/add"

test('adds@sum 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds@append 1 + 2 to equal 12', () => {
  expect(append("1", 2)).toBe("12");
});
