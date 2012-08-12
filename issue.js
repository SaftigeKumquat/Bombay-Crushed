var texts = require('./texts.json');

exports.getIssueStateText = function (issuestate) {
	switch(issuestate) {
		case "calculation":
		case "finished_with_winner":
		case "finished_without_winner":
			return texts.statusstep5;
			break;
		case "verification":
			return texts.statusstep3;
			break;
		case "voting":
			return texts.statusstep4;
			break;
		case "discussion":
			return texts.statusstep2;
			break;
		case "admission":
			return texts.statusstep1;
			break;
		case "canceled_revoked_before_accepted":
		case "canceled_issue_not_accepted":
		case "canceled_after_revocation_during_discussion":
		case "canceled_after_revocation_during_verification":
		case "canceled_no_initiative_admitted":
			return texts.statusstep6;
			break;
	}
}				

