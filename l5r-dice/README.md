# l5r-dice
Dice roller for Legend of the Five Rings 4th edition

## Roll and Keep

The first input is how many dice to roll. The second is how many dice to keep. The third is a modifier to the end total.

### Roll (first Input)

The total of your skill + trait, trait roll, etc. By the rules, if this totals more than 10, it translates into extra kept dice. This roller will translate that for you. For example, entering 12k2 will result in actually rolling 10 dice and keeping 3.

### Keep (second input)

The number of dice to "keep". The roller will keep the highest dice rolled after rerolles and explosions and sum the result to get the total of your dice rolled.

### Bonuses/Penalties (last input)

Negative numbers are allowed in the last input, and will be applied as a penalty.

## Options

### Explode 10's

If a 10 is rolled, that die is rolled again and both results are added tot the total. This will chain until a non-10 is rolled.

This is the default for L5R rolls, and should be disabled for untrained skills.

### Reroll 1's

If a 1 is rolled, that die will be rerolled once, and the new result is considered. This is mostly applicable for skill emphases.
