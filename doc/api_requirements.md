Übersicht:
==========

Profilbild
----------

GET /member_image


Aktuelle Initiativen
--------------------

*TODO*


Deine Delegierten
-----------------

Delegations:
    GET /delegation:
        initiative options
        member_options
            member_id(self)
        direction="out"
        scope="unit","are","issue"
    RESULT: users that have delegations from self

*TODO* Which actions of users are displayed?
Actions of delegations:


Neuigkeiten
-----------

*TODO*


Deine Themen
------------

*Last finished voting*:

    GET /issue
        unit options
            unit_id=list,of,all,unit_ids
        area options
            area_id = list,of,all,area_ids
        issue_state = finished_with_winner
        issue_closed_after = (timestamp)
    RESULT: finished issues since timestamp

sort by timestamp in RESULT.closed and choose youngest finished issue
I refer to the resulting issue as RES

get numbers of the initiatives in the found issue:

    GET /initiative
        issue options
            issue_id = RES.id
        initiative options
            initiative_winner=True
    RESULT: Winning initiative WINNER

data needed for the pie chart, get Voters:

    WINNER.positive_votes => pVoters
    WINNER.negative_votes => nVoters

direct = 0
indirect = 0
for pv in pVoters:
    if pv.delegate_member_id != NULL:
        direct += 1
        indirect += pv.weight -1

same for nVoters


*not far from quorum, ending soon*

*TODO*


Themen
======
*TODO*

Kontakte & Delegation
=====================
*TODO*

Profil
======
*TODO*

Zeitleiste
==========
*TODO*
