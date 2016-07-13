Idea about slots:

Files with 'slot.' prefix should contain a function which creates a slot
definition based on given arguments.

Slots should be somehow accountable per room and have their priority for
fulfillment. In ideal case all slots should be occupied. In reality,
city controller must have a slot fulfilement queue and try to fill them
by any means. In early stages that means waiting for spawns, later that
could get as complicated as requesting reinforcements from nearby cities.

City controller should iterate through slot definitions from time to time
in order to find vacant slots and place them in slot queue by priority.
Priority is hardcoded for each slot, namely slots that have high priority
include 'first miner in mine', 'first carrier in spawn', 'first upgrader'.
We may have 'priority' calculated later on.

Slots have a dependency on 'roles'. Read roles.js next.

