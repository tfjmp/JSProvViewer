function JSProvParseJSON(text){
	var data = JSON.parse(text);
	entities = data.entity;
	for(key in entities){
		if(entities[key]['prov:type']=='prov:agent'){
			agent(key);
		}else{
			entity(key);
		}
	}
	activities = data.activity;
	for(key in activities){
		activity(key);
	}
	agents = data.agent;
	for(key in agents){
		agent(key);
	}
	generated = data.wasGeneratedBy;
	for(key in generated){
		wasGeneratedBy(generated[key]['prov:entity'], generated[key]['prov:activity']);
	}
	associated = data.wasAssociatedWith;
	for(key in associated){
		wasAssociatedWith(associated[key]['prov:activity'], associated[key]['prov:agent']);
		if(associated[key]['prov:plan']!=undefined){
			hadPlan(associated[key]['prov:agent'], associated[key]['prov:plan'])
		}
	}	
	_used = data.used;
	for(key in _used){
		used(_used[key]['prov:activity'], _used[key]['prov:entity']);
	}
	derived = data.wasDerivedFrom;
	for(key in derived){
		wasDerivedFrom(derived[key]['prov:generatedEntity'], derived[key]['prov:usedEntity']);
	}
	attributed = data.wasAttributedTo;
	for(key in attributed){
		wasAttributedTo(attributed[key]['prov:entity'], attributed[key]['prov:agent']);
	}
	
	informed = data.wasInformedBy;
	for(key in informed){
		wasInformedBy(informed[key]['prov:informant'], informed[key]['prov:informed']);
	}
	
	derived = data.derivedByInsertionFrom;
	for(key in derived){
		derivedByInsertionFrom(derived[key]['prov:before'], derived[key]['prov:after']);
		for(i=0; i < derived[key]['prov:key-entity-set'].length; i++){
			hadDictionaryMember(derived[key]['prov:after'], derived[key]['prov:key-entity-set'][i][1]);
		}
	}
	specialization = data.specializationOf;
	for(key in specialization){
		specializationOf(specialization[key]['prov:entity'], specialization[key]['prov:specialization']);
	}
	alternate = data.alternateOf;
	for(key in alternate){
		alternateOf(alternate[key]['prov:entity'], alternate[key]['prov:alternate']);
	}
	JSProvDraw();
}