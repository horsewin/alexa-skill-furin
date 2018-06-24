all:
	ask deploy -p default

l:
	ask lambda upload -f ask-custom-Furin-default -s ./lambda/custom

log:
	ask lambda log --function ask-custom-Furin-default --start-time 1hago

model:
	ask api update-model -s amzn1.ask.skill.8b125d79-390e-4b3c-a28e-8e289022a071 -f models/ja-JP.json -l ja-JP -p default

submit:
	$(eval SKILLID := $(shell cat .ask/config | jq '.deploy_settings.default.skill_id'))
	ask api submit --skill-id $(SKILLID)
