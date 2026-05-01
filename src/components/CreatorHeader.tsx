export default function CreatorHeader({ creator }: any) {
  return (
    <div className="creator-header">
      <div className="creator-header__top">
        <img
          src={creator.avatar || creator.image || "https://via.placeholder.com/150"}
          alt={creator.name}
          className="creator-header__image"
        />
        <div className="creator-header__info">
          <h1 className="creator-header__name">{creator.name}</h1>
          <p className="creator-header__category">{creator.category}</p>
        </div>
      </div>
    </div>
  );
}