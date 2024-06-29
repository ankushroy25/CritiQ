import Card from "./Card";
import "./History.css";
// import { blog01, blog02, blog03, blog04, blog05 } from "./imports.js"

const History = () => {
  return (
    <div className="gpt3__blog section__padding">
      <div className="gpt3__blog-heading">
        <h1 className="gradient__text">
          A lot is happening, We are blogging about it.
        </h1>
      </div>
      <div className="gpt3__blog-container">
        <div className="gpt3__blog-container_groupA">
          <Card
            imgUrl=""
            date="Jul 05,2022"
            title="GPT-3 and Open  AI is the future. Let us exlore how it is?"
          />
        </div>
        <div className="gpt3__blog-container_groupB">
          <Card
            imgUrl=""
            date="Jul 05,2022"
            title="GPT-3 and Open  AI is the future. Let us exlore how it is?"
          />
          <Card
            imgUrl=""
            date="Jul 05,2022"
            title="GPT-3 and Open  AI is the future. Let us exlore how it is?"
          />
          <Card
            imgUrl=""
            date="Jul 05,2022"
            title="GPT-3 and Open  AI is the future. Let us exlore how it is?"
          />
          <Card
            imgUrl=""
            date="Jul 05,2022"
            title="GPT-3 and Open  AI is the future. Let us exlore how it is?"
          />
        </div>
      </div>
    </div>
  );
};

export default History;
