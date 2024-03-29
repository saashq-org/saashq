import * as React from "react";
import { IFaqCategory } from "../../types";

type Props = {
  category: IFaqCategory;
  childrens?: IFaqCategory[];
  getCurrentItem?: (currentCategory: IFaqCategory) => void;
  onClick: (category?: IFaqCategory) => void;
};

export default class Category extends React.Component<Props> {
  handleOnClick = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    const { category, getCurrentItem, childrens, onClick } = this.props;

    if (childrens && getCurrentItem) {
      childrens.length === 0 ? onClick(category) : getCurrentItem(category);
    } else {
      onClick(category);
    }
  };

  renderCount() {
    const { childrens, category } = this.props;

    if (!childrens) {
      return category.numOfArticles;
    }

    return childrens.length === 0 ? category.numOfArticles : childrens.length;
  }

  render() {
    const { category } = this.props;

    return (
      <div className="saashq-list-item faq-item" onClick={this.handleOnClick}>
        <div className="saashq-left-side">
          <i className={`saashq-icon-${category.icon}`} />
        </div>
        <div className="saashq-right-side">
          <div className="saashq-name">
            {category.title} <span>({this.renderCount()})</span>
          </div>
          <div className="description">{category.description}</div>
        </div>
      </div>
    );
  }
}
