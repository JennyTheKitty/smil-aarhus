INSERT INTO smil_aarhus.tr_language VALUES ('en', 'English'), ('da', 'Dansk');

INSERT INTO smil_aarhus_private.user_role VALUES ('smil_admin', 'administrator'), ('smil_organizer', 'event organizer');

INSERT INTO smil_aarhus.event_category
VALUES (DEFAULT);

INSERT INTO smil_aarhus.event_category_tr
VALUES (1, 'en', 'Members Night');

INSERT INTO smil_aarhus.event_category_tr
VALUES (1, 'da', 'Medlemsaften');

INSERT INTO smil_aarhus.event_category
VALUES (DEFAULT);

INSERT INTO smil_aarhus.event_category_tr
VALUES (2, 'en', 'Rope Workshop');

INSERT INTO smil_aarhus.event_category_tr
VALUES (2, 'da', 'Rebhygge');

INSERT INTO smil_aarhus.event_category
VALUES (DEFAULT);

INSERT INTO smil_aarhus.event_category_tr
VALUES (3, 'en', 'Queer');

INSERT INTO smil_aarhus.event_category
VALUES (DEFAULT);

INSERT INTO smil_aarhus.event_category_tr
VALUES (4, 'en', 'Kink Youth');

INSERT INTO smil_aarhus.event
VALUES (DEFAULT,  date_trunc('day', now()) + (INTERVAL '1' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '2' day) + (INTERVAL '2' hour), FALSE, 1);

INSERT INTO smil_aarhus.event_tr
VALUES (1, 'en', 'Members Night', 'Ordinary members night.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (1, 'da', 'Medlemsaften', 'Normal medlemsaften.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '30' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '31' day) + (INTERVAL '2' hour), FALSE, 1);

INSERT INTO smil_aarhus.event_tr
VALUES (2, 'en', 'Members Night', 'Ordinary members night.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (2, 'da', 'Medlemsaften', 'Normal medlemsaften.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '30' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '31' day) + (INTERVAL '2' hour), FALSE, 1);

INSERT INTO smil_aarhus.event_tr
VALUES (3, 'en', 'Members Night', 'Ordinary members night.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (3, 'da', 'Medlemsaften', 'Normal medlemsaften.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '10' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '11' day) + (INTERVAL '2' hour), FALSE, 1);

INSERT INTO smil_aarhus.event_tr
VALUES (
    4,
    'en',
    'Members Night - with new to SMIL',
    'Ordinary members night. But also new to SMIL.',
    'SMIL Aarhus'
);

INSERT INTO smil_aarhus.event_tr
VALUES (
    4,
    'da',
    'Medlemsaften - med ny i SMIL',
    'Normal medlemsaften. Men også med ny i SMIL.',
    'SMIL Aarhus'
);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '34' day) + (INTERVAL '20' hour), date_trunc('day', now()) + (INTERVAL '35' day) + (INTERVAL '3' hour), TRUE, 1);

INSERT INTO smil_aarhus.event_tr
VALUES (5, 'en', 'Partyyyy', 'Test party.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (5, 'da', 'Feeeeest', 'Test fest.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event
VALUES (DEFAULT, date_trunc('day', now()) + (INTERVAL '23' day) + (INTERVAL '20' hour), date_trunc('day', now()) + (INTERVAL '24' day) + (INTERVAL '3' hour), FALSE, 4);

INSERT INTO smil_aarhus.event_tr
VALUES (6, 'en', 'Kink Youth Halloween Party', 'Test party.', 'SMIL Aarhus', NULL);

INSERT INTO smil_aarhus.event_tr
VALUES (6, 'da', 'Kink Youth Halloween Party', 'Test fest.', 'SMIL Aarhus', NULL);

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
VALUES ('home', 'da', '<h1>Velkommen til SMIL Aarhus</h1><p>Vi er en forening for personer, der er interesseret i og dyrker BDSM, sadomasochisme, hård sex og en bred vifte af kinks inden for samme område.</p><p>Er du nysgerrig og overvejer at blive medlem, kan du læse mere under "Bliv medlem" og bruge kalenderen til at finde en Informationsaften, hvor du kan få en rundvisning og stille spørgsmål til det medlem, der viser dig rundt. Ønsker du at besøge nogle af vores åbne arrangementer, kan du se i kalenderen efter de events, hvor man kan komme som dagsmedlem.</p><p>Er du allerede medlem er kalenderen god at holde øje med, når du planlægger leg i den udvidede åbningstid, da der godt kan ligge arrangementer i udvidet åbningstid.</p>');

INSERT INTO smil_aarhus.page_tr
VALUES ('home', 'en', '<h1>Welcome to SMIL Aarhus</h1><p>We are an association for people who are interested in and practice BDSM, sadomasochism, hard sex and a wide range of kinks in the same area.</p><p> If you are curious and considering becoming a member, you can read more under "Become a member" and use the calendar to find an Information Evening where you can get a tour and ask questions to the member who shows you around. If you want to visit some of our open events, you can look in the calendar for the events where you can come as a day member.</p><p>If you are already a member, the calendar is good to keep an eye on when you plan to play in the extended opening hours, as there may well be events during extended opening hours.</p>');

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
(group_id, language_code, title, description)
VALUES(1, 'en', 'Peer Rope', '<p>At Peer Rope we meet for the ropes. We do not bind a particular style, but meet around the joy of rope. </p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(1, 'da', 'Peer Rope', '<p>Til Peer Rope mødes vi om rebene. Vi binder ikke en bestemt stilart, men mødes omkring glæden ved reb.</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(2, 'en', 'Peer Whip', '<p>Peer Whip is for those with a passion for floggers, whips, canes, etc. We meet in order to learn, practice, and give each other feedback.</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(2, 'da', 'Peer Whip', '<p>Idéen med Peer Whip er, at de som har passion for slagredskaber mødes for at lære, øve og give feedback.</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(3, 'en', 'Kink Academy', '<p>...</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(3, 'da', 'Kink Academy', '<p>...</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(4, 'en', 'Queer Community', '<p>...</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(4, 'da', 'Queer Community', '<p>...</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(5, 'en', 'Kink Youth', '<p>...</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(5, 'da', 'Kink Youth', '<p>...</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(6, 'en', 'Shaaaaark', '<p>Ikea</p>');
INSERT INTO smil_aarhus.group_tr
(group_id, language_code, title, description)
VALUES(6, 'da', 'Haaaaaaaj', '<p>Ikea</p>');

