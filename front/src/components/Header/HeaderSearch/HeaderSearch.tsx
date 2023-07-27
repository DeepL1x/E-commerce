import "./HeaderSearch.scss"

const HeaderSearch = () => {
  return (
    <div className="header-search-container">
      <div>
        <button>
          <img src="/assets/search.svg" alt="search" />
          <span>Search</span>
        </button>
      </div>
    </div>
  )
}

export default HeaderSearch
