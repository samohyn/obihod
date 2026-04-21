import { Icon } from '../_shared/Icon'
import { TopoPattern } from '../_shared/graphics'

export function B2B() {
  return (
    <section id="b2b">
      <div className="topo-bg">
        <TopoPattern opacity={0.12} />
      </div>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">§&nbsp;09 · Для юридических лиц</span>
            <h2 className="h-xl">
              УК, посёлки,
              <br />
              застройщики.
            </h2>
          </div>
          <p className="section-sub">
            Два B2B-направления с&nbsp;отдельными договорами, отсрочкой оплаты и&nbsp;закреплённым
            менеджером. Коммерческие условия — индивидуально, KPI — в&nbsp;SLA.
          </p>
        </div>

        <div className="b2b-grid">
          <div className="b2b-card">
            <div className="b2b-label">Обиход.Коттедж</div>
            <div className="b2b-title">Годовой контракт для&nbsp;коттеджных посёлков и&nbsp;УК</div>
            <div className="b2b-desc">
              Один договор на&nbsp;всё: уборка снега, арбо, вывоз мусора, мелкий демонтаж. Один
              менеджер, один ежемесячный счёт, ноль срывов собраний жителей.
            </div>
            <div className="b2b-stats">
              <div className="b2b-stat">
                <div className="v" style={{ whiteSpace: 'nowrap', fontSize: '22px' }}>
                  360к–1,8М
                </div>
                <div className="l">₽/ГОД · ВИЛКА</div>
              </div>
              <div className="b2b-stat">
                <div className="v">45 дн</div>
                <div className="l">ОТСРОЧКА</div>
              </div>
              <div className="b2b-stat">
                <div className="v">SLA 4ч</div>
                <div className="l">НА ВЫЕЗД</div>
              </div>
            </div>
            <div className="b2b-cta">
              <a href="#contact" className="btn btn-primary btn-lg">
                Запросить КП для посёлка
                <Icon.ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="b2b-card">
            <div className="b2b-label">Обиход.Строитель</div>
            <div className="b2b-title">Партнёрская программа для&nbsp;застройщиков ИЖС</div>
            <div className="b2b-desc">
              Расчистка участка под стройку за&nbsp;3&nbsp;дня, документы за&nbsp;24&nbsp;часа,
              отсрочка оплаты до&nbsp;сдачи объекта. Скидка от&nbsp;объёма.
            </div>
            <div className="b2b-stats">
              <div className="b2b-stat">
                <div className="v">−18%</div>
                <div className="l">ОТ 5 ОБЪЕКТОВ</div>
              </div>
              <div className="b2b-stat">
                <div className="v">3 дн</div>
                <div className="l">РАСЧИСТКА</div>
              </div>
              <div className="b2b-stat">
                <div className="v">24 ч</div>
                <div className="l">ДОКУМЕНТЫ</div>
              </div>
            </div>
            <div className="b2b-cta">
              <a href="#contact" className="btn btn-primary btn-lg">
                Стать партнёром
                <Icon.ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
