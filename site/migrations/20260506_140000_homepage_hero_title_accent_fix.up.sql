-- Фикс title_accent: уберём дублирующее «в» (после рендера было «Удаление деревьев в в Москве и МО»).
-- Hero.tsx в JSX уже содержит hardcoded «в » перед span с title_accent — значит в БД
-- title_accent должен быть БЕЗ начального «в».
UPDATE homepage
SET hero_title_accent = 'Москве и МО'
WHERE hero_title_accent = 'в Москве и МО';
