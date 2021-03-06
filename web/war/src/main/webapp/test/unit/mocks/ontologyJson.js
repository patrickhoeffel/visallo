define(['text!/base/test/unit/mocks/ontology.json'], function(json) {
    // Hack ontology for testing
    var ontologyJson = JSON.parse(json),
        name = _.findWhere(ontologyJson.properties, { id: 'http://visallo.org/dev#name' }),
        person = _.findWhere(ontologyJson.concepts, { id: 'http://visallo.org/dev#person' });

    // Delete color for person
    if (person) {
        delete person.color;
    }

    ontologyJson.properties.push({
      'title': 'http://visallo.org/dev#nameNoValidationFormula',
      'displayName': 'Name',
      'userVisible': true,
      'searchable': true,
      'dataType': 'string',
      'dependentPropertyIris': [
        'http://visallo.org/dev#lastName',
        'http://visallo.org/dev#firstName'
      ]
    });

    var first = _.findWhere(ontologyJson.properties, { title: 'http://visallo.org/dev#firstName' })
    first.validationFormula = "propRaw('http://visallo.org/dev#firstName') && propRaw('http://visallo.org/dev#firstName').length > 1";
    var last = _.findWhere(ontologyJson.properties, { title: 'http://visallo.org/dev#lastName' })
    last.validationFormula = "propRaw('http://visallo.org/dev#lastName') && propRaw('http://visallo.org/dev#lastName').length > 2";

    // Add compound field that dependends on another compound
    ontologyJson.properties.push({
        title: 'http://visallo.org/testing#compound1',
        displayName: 'Testing Compound',
        userVisible: true,
        searchable: true,
        dataType: 'string',
        validationFormula:
            'dependentProp("http://visallo.org/dev#title") && ' +
            'dependentProp("http://visallo.org/dev#name")',
        displayFormula:
            'dependentProp("http://visallo.org/dev#name") + ", "' +
            'dependentProp("http://visallo.org/dev#title")',
        dependentPropertyIris: [
            'http://visallo.org/dev#title',
            'http://visallo.org/dev#name'
        ]
    })

    // Add heading
    ontologyJson.properties.push({
        title: 'http://visallo.org/testing#heading1',
        displayName: 'Testing Heading',
        userVisible: true,
        searchable: true,
        dataType: 'double',
        displayType: 'heading'
    })

    ontologyJson.properties.push({
        title: 'http://visallo.org/testing#integer1',
        displayName: 'Testing integer',
        userVisible: true,
        searchable: true,
        dataType: 'integer',
        validationFormula: 'propRaw("http://visallo.org/testing#integer1") > 1'
    })

    ontologyJson.properties.push({
        title: 'http://visallo.org/testing#integer1noform',
        displayName: 'Testing integer',
        userVisible: true,
        searchable: true,
        dataType: 'integer'
    })

    ontologyJson.properties.push({
        title: 'http://visallo.org/testing#number1',
        displayName: 'Testing number',
        userVisible: true,
        searchable: true,
        dataType: 'number'
    })

    // Add video sub concept to test displayType
    ontologyJson.concepts.push({
        id:'http://visallo.org/dev#videoSub',
        title:'http://visallo.org/dev#videoSub',
        displayName:'VideoSub',
        parentConcept:'http://visallo.org/dev#video',
        pluralDisplayName:'VideoSubs',
        searchable:true,
        properties:[]
    });

    ontologyJson.concepts.push({
        id:'http://visallo.org/dev#personSub',
        title:'http://visallo.org/dev#personSub',
        displayName:'PersonSub',
        parentConcept:'http://visallo.org/dev#person',
        pluralDisplayName:'PersonSubs',
        searchable:true,
        properties:[]
    });

    ontologyJson.concepts.push({
        id:'http://visallo.org/dev#formulaTestConcept',
        title:'http://visallo.org/dev#formulaTestConcept',
        displayName:'FormulaTestConcept',
        parentConcept:'http://visallo.org#root',
        pluralDisplayName:'FormulaTestConcepts',
        titleFormula: 'ontology.displayName',
        properties:[]
    })

    ontologyJson.concepts.push({
        id:'http://visallo.org/dev#formulaTest',
        title:'http://visallo.org/dev#formulaTest',
        displayName:'FormulaTest',
        parentConcept:'http://visallo.org#root',
        pluralDisplayName:'FormulaTests',
        titleFormula: `String(
            typeof prop === "function" &&
            typeof propRaw === "function" &&
            typeof longestProp === "function" &&
            typeof ontology === "object" &&
            typeof vertex === 'object' &&
            typeof edge === 'undefined'
        )`,
        properties:[]
    })

    return ontologyJson;
});
