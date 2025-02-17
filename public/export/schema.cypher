CREATE NODE TABLE Other (category STRING,excluded BOOL,id STRING,label STRING,tags STRING[], PRIMARY KEY(id));
CREATE NODE TABLE Event (category STRING,excluded BOOL,id STRING,label STRING,tags STRING[], PRIMARY KEY(id));
CREATE NODE TABLE Location (category STRING,excluded BOOL,id STRING,label STRING,tags STRING[], PRIMARY KEY(id));
CREATE NODE TABLE Observation (explanation STRING,id STRING,page_numbers STRING,project_id STRING,source_category STRING,source_id STRING,source_label STRING,target_category STRING,target_label STRING, PRIMARY KEY(id));
CREATE NODE TABLE Organization (category STRING,excluded BOOL,id STRING,label STRING,tags STRING[], PRIMARY KEY(id));
CREATE NODE TABLE Topic (id STRING,label STRING, PRIMARY KEY(id));
CREATE NODE TABLE Person (category STRING,excluded BOOL,id STRING,label STRING,tags STRING[], PRIMARY KEY(id));
CREATE REL TABLE GROUP HAS_OBSERVATION ( FROM Person TO Observation, FROM Organization TO Observation, FROM Location TO Observation, FROM Event TO Observation, FROM Other TO Observation);
CREATE REL TABLE GROUP RELATED_TO ( FROM Person TO Person, FROM Person TO Organization, FROM Person TO Location, FROM Person TO Event, FROM Person TO Other, FROM Organization TO Person, FROM Organization TO Organization, FROM Organization TO Location, FROM Organization TO Event, FROM Organization TO Other, FROM Location TO Person, FROM Location TO Organization, FROM Location TO Location, FROM Location TO Event, FROM Location TO Other, FROM Event TO Person, FROM Event TO Organization, FROM Event TO Location, FROM Event TO Event, FROM Event TO Other, FROM Other TO Person, FROM Other TO Organization, FROM Other TO Location, FROM Other TO Event, FROM Other TO Other, relationship STRING,source_id STRING);
CREATE REL TABLE GROUP ENTITY_TO_TOPIC ( FROM Person TO Topic, FROM Organization TO Topic, FROM Location TO Topic, FROM Event TO Topic, FROM Other TO Topic);
