-- Откат: возврат старого значения с лишним «в».
UPDATE homepage
SET hero_title_accent = 'в Москве и МО'
WHERE hero_title_accent = 'Москве и МО';
