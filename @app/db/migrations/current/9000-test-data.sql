INSERT INTO smil_aarhus.tr_language VALUES ('EN', 'English', 'english'), ('DA', 'Dansk', 'danish');

INSERT INTO smil_aarhus_private.user_role VALUES ('smil_admin', 'administrator'), ('smil_organizer', 'event organizer');

INSERT INTO smil_aarhus."group"
(id, image_file)
VALUES(1, 'http://media.localhost/smil-aarhus/media/b5693919-37ef-4480-848f-49b099ad4994.jpeg');
INSERT INTO smil_aarhus."group"
(id, image_file)
VALUES(2, 'http://media.localhost/smil-aarhus/media/36a86154-45f7-4066-8f58-0105916e2f2a.jpeg');
INSERT INTO smil_aarhus."group"
(id, image_file)
VALUES(3, 'http://media.localhost/smil-aarhus/media/a9e1f80b-9f69-4c8d-8d43-24d5978c9f42.jpeg');
INSERT INTO smil_aarhus."group"
(id, image_file)
VALUES(4, 'http://media.localhost/smil-aarhus/media/576aac3e-fdcc-4ac7-ae39-6fdbc908f5f2.jpeg');
INSERT INTO smil_aarhus."group"
(id, image_file)
VALUES(5, 'http://media.localhost/smil-aarhus/media/5ac9c28d-ee1b-4e0d-9b50-8b43690faff7.jpeg');
INSERT INTO smil_aarhus."group"
(id, image_file)
VALUES(6, 'http://media.localhost/smil-aarhus/media/85e49295-46a6-4e3c-80df-e480a3303aa8.jpeg');


INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(1, 'EN', 'Peer Rope', 'At Peer Rope we meet for the ropes. We do not bind a particular style, but meet around the joy of rope.', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(1, 'DA', 'Peer Rope', 'Til Peer Rope mødes vi om rebene. Vi binder ikke en bestemt stilart, men mødes omkring glæden ved reb.', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(2, 'EN', 'Peer Whip', 'Peer Whip is for those with a passion for floggers, whips, canes, etc. We meet in order to learn, practice, and give each other feedback.', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(2, 'DA', 'Peer Whip', 'Idéen med Peer Whip er, at de som har passion for slagredskaber mødes for at lære, øve og give feedback.', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(3, 'EN', 'Kink Academy', '...', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(3, 'DA', 'Kink Academy', '...', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(4, 'EN', 'Queer Community', '...', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(4, 'DA', 'Queer Community', '...', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(5, 'EN', 'Kink Youth', '...', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(5, 'DA', 'Kink Youth', '...', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(6, 'EN', 'Shaaaaark', 'Ikea', '');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, short_description, description)
VALUES(6, 'DA', 'Haaaaaaaj', 'Ikea', '');

INSERT INTO smil_aarhus.event_tag
VALUES (DEFAULT);

INSERT INTO smil_aarhus.event_tag_tr
VALUES (1, 'EN', 'Members Night');

INSERT INTO smil_aarhus.event_tag_tr
VALUES (1, 'DA', 'Medlemsaften');

INSERT INTO smil_aarhus.event_tag
VALUES (DEFAULT);

INSERT INTO smil_aarhus.event_tag_tr
VALUES (2, 'EN', 'Parties');

INSERT INTO smil_aarhus.event_tag_tr
VALUES (2, 'DA', 'Fester');

INSERT INTO smil_aarhus.event
VALUES (DEFAULT,  date_trunc('day', now()) + (INTERVAL '1' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '2' day) + (INTERVAL '2' hour), FALSE);

INSERT INTO smil_aarhus.event_tr
VALUES (1, 'EN', 'Members Night', 'Ordinary members night.', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (1, 'DA', 'Medlemsaften', 'Normal medlemsaften.', NULL);

INSERT INTO smil_aarhus.event_via_event_tag
VALUES(1, 1);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '30' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '31' day) + (INTERVAL '2' hour), FALSE);

INSERT INTO smil_aarhus.event_tr
VALUES (2, 'EN', 'Members Night', 'Ordinary members night.', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (2, 'DA', 'Medlemsaften', 'Normal medlemsaften.', NULL);

INSERT INTO smil_aarhus.event_via_event_tag
VALUES(2, 1);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '30' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '31' day) + (INTERVAL '2' hour), FALSE);

INSERT INTO smil_aarhus.event_tr
VALUES (3, 'EN', 'Members Night', 'Ordinary members night.', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (3, 'DA', 'Medlemsaften', 'Normal medlemsaften.', NULL);

INSERT INTO smil_aarhus.event_via_event_tag
VALUES(3, 1);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '10' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '11' day) + (INTERVAL '2' hour), FALSE);

INSERT INTO smil_aarhus.event_tr
VALUES (
    4,
    'EN',
    'Members Night - with new to SMIL',
    'Ordinary members night. But also new to SMIL.'
);

INSERT INTO smil_aarhus.event_tr
VALUES (
    4,
    'DA',
    'Medlemsaften - med ny i SMIL',
    'Normal medlemsaften. Men også med ny i SMIL.'
);

INSERT INTO smil_aarhus.event_via_event_tag
VALUES(4, 1);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '34' day) + (INTERVAL '20' hour), date_trunc('day', now()) + (INTERVAL '35' day) + (INTERVAL '3' hour), TRUE);

INSERT INTO smil_aarhus.event_tr
VALUES (5, 'EN', 'Christmas Partyyyy', 'Test party.', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (5, 'DA', 'Julefeeeeest', 'Test fest.', NULL);

INSERT INTO smil_aarhus.event_via_event_tag
VALUES(5, 2);

INSERT INTO smil_aarhus.event_via_group
VALUES(5, 6);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '23' day) + (INTERVAL '20' hour), date_trunc('day', now()) + (INTERVAL '24' day) + (INTERVAL '3' hour), FALSE);

INSERT INTO smil_aarhus.event_tr
VALUES (6, 'EN', 'Kink Youth Halloween Party', 'Test party.', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (6, 'DA', 'Kink Youth Halloween Party', 'Test fest.', NULL);

INSERT INTO smil_aarhus.event_via_event_tag
VALUES(6, 2);

INSERT INTO smil_aarhus.event_via_group
VALUES(6, 5);

INSERT INTO smil_aarhus.member
VALUES ('132277f6-f147-4c02-b31e-ae5f1fcbc2b6', 'test admin', 'adm', 'smil_admin', TRUE);

INSERT INTO smil_aarhus_private.member_account
VALUES ('132277f6-f147-4c02-b31e-ae5f1fcbc2b6', crypt('123', gen_salt('bf')));

INSERT INTO smil_aarhus.member
VALUES ('beb663ef-ab60-412b-ba5b-29561448e2ac', 'test organizer', 'org', 'smil_organizer', TRUE);

INSERT INTO smil_aarhus_private.member_account
VALUES ('beb663ef-ab60-412b-ba5b-29561448e2ac', crypt('123', gen_salt('bf')));

INSERT INTO smil_aarhus.page
VALUES ('home');

INSERT INTO smil_aarhus.page_tr
VALUES ('home', 'DA', '<h1>Velkommen til SMIL Aarhus</h1><p>Vi er en forening for personer, der er interesseret i og dyrker BDSM, sadomasochisme, hård sex og en bred vifte af kinks inden for samme område.</p><p>Er du nysgerrig og overvejer at blive medlem, kan du læse mere under "Bliv medlem" og bruge kalenderen til at finde en Informationsaften, hvor du kan få en rundvisning og stille spørgsmål til det medlem, der viser dig rundt. Ønsker du at besøge nogle af vores åbne arrangementer, kan du se i kalenderen efter de events, hvor man kan komme som dagsmedlem.</p><p>Er du allerede medlem er kalenderen god at holde øje med, når du planlægger leg i den udvidede åbningstid, da der godt kan ligge arrangementer i udvidet åbningstid.</p>');

INSERT INTO smil_aarhus.page_tr
VALUES ('home', 'EN', '<h1>Welcome to SMIL Aarhus</h1><p>We are an association for people who are interested in and practice BDSM, sadomasochism, hard sex and a wide range of kinks in the same area.</p><p> If you are curious and considering becoming a member, you can read more under "Become a member" and use the calendar to find an Information Evening where you can get a tour and ask questions to the member who shows you around. If you want to visit some of our open events, you can look in the calendar for the events where you can come as a day member.</p><p>If you are already a member, the calendar is good to keep an eye on when you plan to play in the extended opening hours, as there may well be events during extended opening hours.</p>');


INSERT INTO smil_aarhus.page
VALUES ('faq');

INSERT INTO smil_aarhus.page_tr
VALUES ('faq', 'DA', '');

INSERT INTO smil_aarhus.page_tr
VALUES ('faq', 'EN', '');
