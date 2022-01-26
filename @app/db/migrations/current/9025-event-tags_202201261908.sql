INSERT INTO image (id, "path", width, height, credit) VALUES
  ('ae48997e-a29d-4021-ba54-d38ad09dc7e1'::uuid, 'media/ae48997e-a29d-4021-ba54-d38ad09dc7e1.jpeg', 1431, 954, '<p><a href="https://fetlife.com/users/4607313">MagicLight</a></p>'),
  ('96af83e7-75b3-4934-b496-b630343411e2'::uuid, 'media/96af83e7-75b3-4934-b496-b630343411e2.jpeg', 3000, 2000, '<p><a href="https://www.pexels.com/@olly">Andrea Piacquadio</a></p>'),
  ('884fc6df-a7ac-45f5-981a-864a4f35c8a4'::uuid, 'media/884fc6df-a7ac-45f5-981a-864a4f35c8a4.jpeg', 3427, 2285, '<p><a href="https://unsplash.com/@mrs80z">Mercedes Mehling</a></p>');

INSERT INTO smil_aarhus.event_tag (id,image) VALUES
	 ('2cf989bf-6b2a-43c2-994a-fc27ec5bb173','ae48997e-a29d-4021-ba54-d38ad09dc7e1'),
	 ('5f7644f2-5039-4c4c-b1ab-70b0787832ac','96af83e7-75b3-4934-b496-b630343411e2'),
	 ('144a3104-6eb2-471f-be96-4b67c79adb76','884fc6df-a7ac-45f5-981a-864a4f35c8a4'),
	 ('4dd6f6a3-3b46-450a-850c-18a4bb69fe07',NULL),
	 ('9f4e55e2-9215-4173-958c-7bacd96e4820',NULL);

INSERT INTO smil_aarhus.event_tag_tr (tag_id,language_code,title) VALUES
	 ('2cf989bf-6b2a-43c2-994a-fc27ec5bb173','DA','Medlemsaften'),
	 ('2cf989bf-6b2a-43c2-994a-fc27ec5bb173','EN','Members Night'),
	 ('5f7644f2-5039-4c4c-b1ab-70b0787832ac','DA','Fester'),
	 ('5f7644f2-5039-4c4c-b1ab-70b0787832ac','EN','Parties'),
	 ('144a3104-6eb2-471f-be96-4b67c79adb76','DA','Pride'),
	 ('144a3104-6eb2-471f-be96-4b67c79adb76','EN','Pride'),
	 ('4dd6f6a3-3b46-450a-850c-18a4bb69fe07','DA','Info'),
	 ('4dd6f6a3-3b46-450a-850c-18a4bb69fe07','EN','Info'),
	 ('9f4e55e2-9215-4173-958c-7bacd96e4820','DA','Åbent hus'),
	 ('9f4e55e2-9215-4173-958c-7bacd96e4820','EN','Open house');
