INSERT INTO smil_aarhus.tr_language VALUES ('EN', 'English', 'english'), ('DA', 'Dansk', 'danish');

INSERT INTO smil_aarhus_private.user_role VALUES ('smil_admin', 'administrator'), ('smil_organizer', 'event organizer');

-- INSERT INTO smil_aarhus.event_tag
-- VALUES (1);

-- INSERT INTO smil_aarhus.event_tag_tr
-- VALUES (1, 'EN', 'Members Night');

-- INSERT INTO smil_aarhus.event_tag_tr
-- VALUES (1, 'DA', 'Medlemsaften');

-- INSERT INTO smil_aarhus.event_tag
-- VALUES (2);

-- INSERT INTO smil_aarhus.event_tag_tr
-- VALUES (2, 'EN', 'Parties');

-- INSERT INTO smil_aarhus.event_tag_tr
-- VALUES (2, 'DA', 'Fester');

-- INSERT INTO smil_aarhus.event
-- VALUES (1,  date_trunc('day', now()) + (INTERVAL '1' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '2' day) + (INTERVAL '2' hour), FALSE);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (1, 'EN', 'Members Night', 'Ordinary members night.', NULL);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (1, 'DA', 'Medlemsaften', 'Normal medlemsaften.', NULL);

-- INSERT INTO smil_aarhus.event_via_event_tag
-- VALUES(1, 1);

-- INSERT INTO smil_aarhus.event
-- VALUES (2, date_trunc('day', now()) + (INTERVAL '30' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '31' day) + (INTERVAL '2' hour), FALSE);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (2, 'EN', 'Members Night', 'Ordinary members night.', NULL);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (2, 'DA', 'Medlemsaften', 'Normal medlemsaften.', NULL);

-- INSERT INTO smil_aarhus.event_via_event_tag
-- VALUES(2, 1);

-- INSERT INTO smil_aarhus.event
-- VALUES (3, date_trunc('day', now()) + (INTERVAL '30' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '31' day) + (INTERVAL '2' hour), FALSE);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (3, 'EN', 'Members Night', 'Ordinary members night.', NULL);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (3, 'DA', 'Medlemsaften', 'Normal medlemsaften.', NULL);

-- INSERT INTO smil_aarhus.event_via_event_tag
-- VALUES(3, 1);

-- INSERT INTO smil_aarhus.event
-- VALUES (4, date_trunc('day', now()) + (INTERVAL '10' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '11' day) + (INTERVAL '2' hour), FALSE);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (
--     4,
--     'EN',
--     'Members Night - with new to SMIL',
--     'Ordinary members night. But also new to SMIL.'
-- );

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (
--     4,
--     'DA',
--     'Medlemsaften - med ny i SMIL',
--     'Normal medlemsaften. Men også med ny i SMIL.'
-- );

-- INSERT INTO smil_aarhus.event_via_event_tag
-- VALUES(4, 1);

-- INSERT INTO smil_aarhus.event
-- VALUES (5, date_trunc('day', now()) + (INTERVAL '34' day) + (INTERVAL '20' hour), date_trunc('day', now()) + (INTERVAL '35' day) + (INTERVAL '3' hour), TRUE);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (5, 'EN', 'Christmas Partyyyy', 'Test party.', NULL);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (5, 'DA', 'Julefeeeeest', 'Test fest.', NULL);

-- INSERT INTO smil_aarhus.event_via_event_tag
-- VALUES(5, 2);

-- INSERT INTO smil_aarhus.event_via_group
-- VALUES(5, 6);

-- INSERT INTO smil_aarhus.event
-- VALUES (6, date_trunc('day', now()) + (INTERVAL '23' day) + (INTERVAL '20' hour), date_trunc('day', now()) + (INTERVAL '24' day) + (INTERVAL '3' hour), FALSE);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (6, 'EN', 'Kink Youth Halloween Party', 'Test party.', NULL);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (6, 'DA', 'Kink Youth Halloween Party', 'Test fest.', NULL);

-- INSERT INTO smil_aarhus.event_via_event_tag
-- VALUES(6, 2);

-- INSERT INTO smil_aarhus.event_via_group
-- VALUES(6, 5);


-- INSERT INTO smil_aarhus.event
-- VALUES (7,  date_trunc('day', now()) + (INTERVAL '1' day) + (INTERVAL '19' hour), date_trunc('day', now()) + (INTERVAL '2' day) + (INTERVAL '2' hour), FALSE, NULL, 'medlemsaften');

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (7, 'EN', 'Members Night', 'Ordinary members night.', NULL);

-- INSERT INTO smil_aarhus.event_tr
-- VALUES (7, 'DA', 'Medlemsaften', 'Normal medlemsaften.', NULL);

INSERT INTO smil_aarhus.member
VALUES ('132277f6-f147-4c02-b31e-ae5f1fcbc2b6', 'test admin', 'adm', 'smil_admin', TRUE);

INSERT INTO smil_aarhus_private.member_account
VALUES ('132277f6-f147-4c02-b31e-ae5f1fcbc2b6', crypt('123', gen_salt('bf')));

INSERT INTO smil_aarhus.member
VALUES ('beb663ef-ab60-412b-ba5b-29561448e2ac', 'test organizer', 'org', 'smil_organizer', TRUE);

INSERT INTO smil_aarhus_private.member_account
VALUES ('beb663ef-ab60-412b-ba5b-29561448e2ac', crypt('123', gen_salt('bf')));

INSERT INTO smil_aarhus.page
VALUES ('5d70cca4-7d84-43eb-94f7-833a8d618b31');

INSERT INTO smil_aarhus.page_tr
VALUES ('5d70cca4-7d84-43eb-94f7-833a8d618b31', 'DA', '<h1>Velkommen til SMIL Aarhus</h1><p>Vi er en forening for personer, der er interesseret i og dyrker BDSM, sadomasochisme, hård sex og en bred vifte af kinks inden for samme område.</p><p>Er du nysgerrig og overvejer at blive medlem, kan du læse mere under "Bliv medlem" og bruge kalenderen til at finde en Informationsaften, hvor du kan få en rundvisning og stille spørgsmål til det medlem, der viser dig rundt. Ønsker du at besøge nogle af vores åbne arrangementer, kan du se i kalenderen efter de events, hvor man kan komme som dagsmedlem.</p><p>Er du allerede medlem er kalenderen god at holde øje med, når du planlægger leg i den udvidede åbningstid, da der godt kan ligge arrangementer i udvidet åbningstid.</p>');

INSERT INTO smil_aarhus.page_tr
VALUES ('5d70cca4-7d84-43eb-94f7-833a8d618b31', 'EN', '<h1>Welcome to SMIL Aarhus</h1><p>We are an association for people who are interested in and practice BDSM, sadomasochism, hard sex and a wide range of kinks in the same area.</p><p> If you are curious and considering becoming a member, you can read more under "Become a member" and use the calendar to find an Information Evening where you can get a tour and ask questions to the member who shows you around. If you want to visit some of our open events, you can look in the calendar for the events where you can come as a day member.</p><p>If you are already a member, the calendar is good to keep an eye on when you plan to play in the extended opening hours, as there may well be events during extended opening hours.</p>');

INSERT INTO smil_aarhus.news
(id, published_at, updated_at)
VALUES('a840f488-a5f1-45cc-b63e-df1792e3bb0f', now(), now());
INSERT INTO smil_aarhus.news
(id, published_at, updated_at)
VALUES('78ae3919-35a2-43cd-bf2d-26b3982a3d93', now() - (INTERVAL '5' day), now() - (INTERVAL '1' day));
INSERT INTO smil_aarhus.news
(id, published_at, updated_at)
VALUES('62ada943-5578-44a5-9e74-0be351d70f18', now() - (INTERVAL '10' day), now() - (INTERVAL '10' day));


INSERT INTO smil_aarhus.news_tr
(news_id, language_code, "title", "content")
VALUES('62ada943-5578-44a5-9e74-0be351d70f18', 'DA', 'Coronagenåbning', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sociis natoque penatibus et magnis dis parturient montes nascetur. Eget mi proin sed libero enim sed. Vitae justo eget magna fermentum iaculis eu. Tortor dignissim convallis aenean et tortor at risus viverra. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas. At tempor commodo ullamcorper a lacus. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. Elementum nibh tellus molestie nunc non blandit massa. Lorem sed risus ultricies tristique. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Sapien eget mi proin sed libero enim. Eu scelerisque felis imperdiet proin. Morbi tempus iaculis urna id volutpat. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Id cursus metus aliquam eleifend mi in nulla.</p><p>Ut morbi tincidunt augue interdum velit euismod in pellentesque. Blandit cursus risus at ultrices mi tempus. In nibh mauris cursus mattis molestie a iaculis at erat. Sed felis eget velit aliquet sagittis. Ante in nibh mauris cursus mattis. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Gravida quis blandit turpis cursus in hac. Porttitor leo a diam sollicitudin. Pretium fusce id velit ut tortor. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sed libero enim sed faucibus turpis in eu mi bibendum. Sed id semper risus in hendrerit gravida rutrum quisque non. Turpis in eu mi bibendum. Viverra nibh cras pulvinar mattis.</p>');
INSERT INTO smil_aarhus.news_tr
(news_id, language_code, "title", "content")
VALUES('62ada943-5578-44a5-9e74-0be351d70f18', 'EN', 'Coronareopening', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sociis natoque penatibus et magnis dis parturient montes nascetur. Eget mi proin sed libero enim sed. Vitae justo eget magna fermentum iaculis eu. Tortor dignissim convallis aenean et tortor at risus viverra. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas. At tempor commodo ullamcorper a lacus. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. Elementum nibh tellus molestie nunc non blandit massa. Lorem sed risus ultricies tristique. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Sapien eget mi proin sed libero enim. Eu scelerisque felis imperdiet proin. Morbi tempus iaculis urna id volutpat. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Id cursus metus aliquam eleifend mi in nulla.</p><p>Ut morbi tincidunt augue interdum velit euismod in pellentesque. Blandit cursus risus at ultrices mi tempus. In nibh mauris cursus mattis molestie a iaculis at erat. Sed felis eget velit aliquet sagittis. Ante in nibh mauris cursus mattis. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Gravida quis blandit turpis cursus in hac. Porttitor leo a diam sollicitudin. Pretium fusce id velit ut tortor. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sed libero enim sed faucibus turpis in eu mi bibendum. Sed id semper risus in hendrerit gravida rutrum quisque non. Turpis in eu mi bibendum. Viverra nibh cras pulvinar mattis.</p>');
INSERT INTO smil_aarhus.news_tr
(news_id, language_code, "title", "content")
VALUES('a840f488-a5f1-45cc-b63e-df1792e3bb0f', 'DA', 'Ny hjemmeside', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sociis natoque penatibus et magnis dis parturient montes nascetur. Eget mi proin sed libero enim sed. Vitae justo eget magna fermentum iaculis eu. Tortor dignissim convallis aenean et tortor at risus viverra. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas. At tempor commodo ullamcorper a lacus. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. Elementum nibh tellus molestie nunc non blandit massa. Lorem sed risus ultricies tristique. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Sapien eget mi proin sed libero enim. Eu scelerisque felis imperdiet proin. Morbi tempus iaculis urna id volutpat. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Id cursus metus aliquam eleifend mi in nulla.</p><p>Ut morbi tincidunt augue interdum velit euismod in pellentesque. Blandit cursus risus at ultrices mi tempus. In nibh mauris cursus mattis molestie a iaculis at erat. Sed felis eget velit aliquet sagittis. Ante in nibh mauris cursus mattis. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Gravida quis blandit turpis cursus in hac. Porttitor leo a diam sollicitudin. Pretium fusce id velit ut tortor. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sed libero enim sed faucibus turpis in eu mi bibendum. Sed id semper risus in hendrerit gravida rutrum quisque non. Turpis in eu mi bibendum. Viverra nibh cras pulvinar mattis.</p>');
INSERT INTO smil_aarhus.news_tr
(news_id, language_code, "title", "content")
VALUES('a840f488-a5f1-45cc-b63e-df1792e3bb0f', 'EN', 'New website', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sociis natoque penatibus et magnis dis parturient montes nascetur. Eget mi proin sed libero enim sed. Vitae justo eget magna fermentum iaculis eu. Tortor dignissim convallis aenean et tortor at risus viverra. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas. At tempor commodo ullamcorper a lacus. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. Elementum nibh tellus molestie nunc non blandit massa. Lorem sed risus ultricies tristique. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Sapien eget mi proin sed libero enim. Eu scelerisque felis imperdiet proin. Morbi tempus iaculis urna id volutpat. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Id cursus metus aliquam eleifend mi in nulla.</p><p>Ut morbi tincidunt augue interdum velit euismod in pellentesque. Blandit cursus risus at ultrices mi tempus. In nibh mauris cursus mattis molestie a iaculis at erat. Sed felis eget velit aliquet sagittis. Ante in nibh mauris cursus mattis. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Gravida quis blandit turpis cursus in hac. Porttitor leo a diam sollicitudin. Pretium fusce id velit ut tortor. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sed libero enim sed faucibus turpis in eu mi bibendum. Sed id semper risus in hendrerit gravida rutrum quisque non. Turpis in eu mi bibendum. Viverra nibh cras pulvinar mattis.</p>');
INSERT INTO smil_aarhus.news_tr
(news_id, language_code, "title", "content")
VALUES('78ae3919-35a2-43cd-bf2d-26b3982a3d93', 'DA', 'Test', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sociis natoque penatibus et magnis dis parturient montes nascetur. Eget mi proin sed libero enim sed. Vitae justo eget magna fermentum iaculis eu. Tortor dignissim convallis aenean et tortor at risus viverra. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas. At tempor commodo ullamcorper a lacus. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. Elementum nibh tellus molestie nunc non blandit massa. Lorem sed risus ultricies tristique. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Sapien eget mi proin sed libero enim. Eu scelerisque felis imperdiet proin. Morbi tempus iaculis urna id volutpat. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Id cursus metus aliquam eleifend mi in nulla.</p><p>Ut morbi tincidunt augue interdum velit euismod in pellentesque. Blandit cursus risus at ultrices mi tempus. In nibh mauris cursus mattis molestie a iaculis at erat. Sed felis eget velit aliquet sagittis. Ante in nibh mauris cursus mattis. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Gravida quis blandit turpis cursus in hac. Porttitor leo a diam sollicitudin. Pretium fusce id velit ut tortor. Egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sed libero enim sed faucibus turpis in eu mi bibendum. Sed id semper risus in hendrerit gravida rutrum quisque non. Turpis in eu mi bibendum. Viverra nibh cras pulvinar mattis.</p>');

