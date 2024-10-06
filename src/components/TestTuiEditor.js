import React, { useState, useRef, useEffect } from "react";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "../styles/editor.css";
import sampleLogo from "../styles/sampleLogo.jpg";

const TestTuiEditor = () => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    let timeoutId;
    const initializeEditor = () => {
      if (editorRef.current) {
        try {
          const instance = editorRef.current.getInstance();
          setEditorInstance(instance);
          console.log("Editor instance initialized:", instance);
        
          
          // 초기 이미지 로드
          instance.loadImageFromURL('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'blank')
            .then(() => console.log("Initial image loaded"))
            .catch(err => console.error("Error loading initial image:", err));
        } catch (error) {
          console.error("Error initializing editor:", error);
          timeoutId = setTimeout(initializeEditor, 100); 
        }
      } else {
        timeoutId = setTimeout(initializeEditor, 100);
      }
    };
    
    initializeEditor();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleUpload = () => {
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';
    uploadInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        if (editorInstance) {
          editorInstance.loadImageFromURL(imageUrl, 'uploaded')
            .then(() => console.log("Image uploaded successfully"))
            .catch(err => console.error("Error uploading image:", err));
        } else {
          console.error('Editor instance is not available');
        }
      };
      reader.readAsDataURL(file);
    };
    uploadInput.click();
  };

  const handleDownload = () => {
    if (editorInstance) {
      const dataURL = editorInstance.toDataURL();
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = dataURL;
      link.click();
    } else {
      console.error('Editor instance is not available');
    }
  };

  return (
    <div className="editor-container">
      <div className="main-content">
        <header className="header">
          <img src={sampleLogo} width="50px" alt="Sample Logo" />
          <div className="header-buttons">
            <button className="button" onClick={handleUpload} disabled={!editorInstance}>Load</button>
            <button className="button" onClick={handleDownload} disabled={!editorInstance}>Download</button>
            <button className="button">Save</button>
          </div>
        </header>
        <ImageEditor
          ref={editorRef}
          includeUI={{
            loadImage: {
              path: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
              name: 'Blank'
            },
            menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
            initMenu: 'filter',
            uiSize: {
              width: '100%',
              height: 'calc(100vh - 60px)',
            },
            menuBarPosition: 'left',
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics={true}
        />
      </div>
      <div className="right-sidebar">
        <h3>생성형 이미지 추천</h3>
        <p>사진과 유사한 생성형 이미지를 추천합니다.</p>
        <button className="button">생성형 프롬프트 쓰기</button>
        <div className="image-preview"></div>
        <div className="image-preview"></div>
        <div className="image-preview"></div>
      </div>
    </div>
  );
};

export default TestTuiEditor;