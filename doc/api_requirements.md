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

get quorum from policy:

    GET /policy
        policy
            policy_id (integer)

    RESULT: initiative_quorum_num (integer),
            initiative_quorum_den (integer),
            admission_time

get member count:
    GET /unit
        unit options
            unit_id

    RESULT: member_count

quorum = member_count × initiative_quorum_num / initiative_quorum_den

get last login timestamp:

    GET /member
        member options
            member_id
    RESULT: last_login (timestamp)

last_login is used to restrict the initiatives. If the timestamp is too
long or too short ago it may be replaced with a default timestamp like
'admission time' from the policy

get initiatives that are close to the quorum and ending soon:

    GET /initiative
        initiative options
            initiative_revoked(false)
            initiative_created_after(last_login)
            initiative_supporter_count_below(quorum)
            initiative_supporter_count_above(quorum × 0.8)
    RESULT: initiatives

sort initiatives by the created attribute, maybe filter out the ones
where the deadline is more than X days (4?) away




Deine Themen
------------

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
