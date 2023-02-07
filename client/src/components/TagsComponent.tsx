import { title } from 'process';
import React from 'react';
import Tag from './Tag';


interface TagsComponentProps {
    tags: string[] ;
}

const TagsComponent = ({
    tags
}: TagsComponentProps) => {
     return (
        <div  className='tags'>
            {tags.map((tag, index)=> <Tag title={tag} key={index}/>)}

        </div>
      );
    

};

export default TagsComponent;
