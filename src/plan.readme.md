Idea about planning:

Each room (initial and expansions) must proceed through planing phase.
Planning consists of map analysis and zone designation.

Zone designation requires two phases due to the scheduling nature of tasks.
Since it is impossible to get id of construction site on the same tick.
Therefore the process is split to two parts: planning and post_planning.
During post_planning the ids of objects are recorded.

At this point all zones can be created, for now I thought up of such zones:
 * spawns - location(s) which contain spawn point and slots for initial
   builder (if required) and carrier(s) which ensure that spawn(s) have
   energy. Currently I think that extensions should a part of this zone,
   since the 'carrier' slot should be able to bring energy to extensions.
   Maybe this zone should be the owner of global builders too.
 * mines - locations centered on sources and minerals (later). Contains
   slots for 'miners', preferably a 'storage' and a 'rampant' above.
   May contain a temporary slot for 'builder'.
 * controller - location which is centered around a room controller.
   Contains slots for 'upgraders' and 'carriers'. 'storage' and 'rampant'
   are required, so temporary 'builder' may be included.
 * market - location which contains 'terminal' structure. Slots should
   contain 'carriers' and a temporary 'builder'.

For slots, read slot.readme.md

colony evolution could be based on stages. where main process would try to find
achieve designated tasks. Let say first two colony_states are:

 * newly_born: aim of this stage is to set up the mines and logistics.
  - produce 4(?) workers for feeding spawn.
  - produce miners that could bootstrap the mine
  - use initial general workers to produce specialized logistic workers
  - recycle initial workers
  - stage complete when all mines have containers and assigned miners
 * young: aim of this state is to evolve to higher tier controller (2 or 3).
  - construct builders
  - set up initial road infrastructure
  - set up controller zone (container with several workers)
  - guarantee energy transfer from mines to controller container
  - stage completed when colony reaches 3(?) tier controller and all buildings
    are in places.
