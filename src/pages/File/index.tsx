import React, { useState } from 'react';
import { 
  Typography, 
  Table, 
  Button, 
  Space, 
  Upload, 
  message, 
  Modal, 
  Input, 
  Form,
  Card,
  Row,
  Col,
  Tooltip,
  Tag,
  Progress
} from 'antd';
import { 
  UploadOutlined, 
  DownloadOutlined, 
  DeleteOutlined, 
  FolderAddOutlined,
  FileTextOutlined,
  FolderOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FilePdfOutlined,
  FileUnknownOutlined,
  EyeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import './index.less';

const { Title } = Typography;
const { Search } = Input;

// 文件数据接口
interface FileData {
  key: string;
  id: number;
  name: string;
  type: string;
  size: number;
  path: string;
  uploadTime: string;
  uploadUser: string;
}

// 文件类型图标映射
const fileIconMap = {
  'folder': <FolderOutlined style={{ color: '#faad14' }} />,
  'image': <FileImageOutlined style={{ color: '#1890ff' }} />,
  'excel': <FileExcelOutlined style={{ color: '#52c41a' }} />,
  'word': <FileWordOutlined style={{ color: '#1890ff' }} />,
  'pdf': <FilePdfOutlined style={{ color: '#f5222d' }} />,
  'text': <FileTextOutlined style={{ color: '#8c8c8c' }} />,
  'other': <FileUnknownOutlined style={{ color: '#8c8c8c' }} />,
};

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 模拟文件数据
const mockFiles: FileData[] = [
  {
    key: '1',
    id: 1,
    name: '文档资料',
    type: 'folder',
    size: 0,
    path: '/文档资料',
    uploadTime: '2023-01-01',
    uploadUser: '管理员',
  },
  {
    key: '2',
    id: 2,
    name: '图片素材',
    type: 'folder',
    size: 0,
    path: '/图片素材',
    uploadTime: '2023-01-02',
    uploadUser: '管理员',
  },
  {
    key: '3',
    id: 3,
    name: '项目说明.docx',
    type: 'word',
    size: 1024 * 1024 * 2.5,
    path: '/',
    uploadTime: '2023-01-03',
    uploadUser: '张三',
  },
  {
    key: '4',
    id: 4,
    name: '销售数据.xlsx',
    type: 'excel',
    size: 1024 * 1024 * 1.8,
    path: '/',
    uploadTime: '2023-01-04',
    uploadUser: '李四',
  },
  {
    key: '5',
    id: 5,
    name: '产品手册.pdf',
    type: 'pdf',
    size: 1024 * 1024 * 5.2,
    path: '/',
    uploadTime: '2023-01-05',
    uploadUser: '王五',
  },
  {
    key: '6',
    id: 6,
    name: 'logo.png',
    type: 'image',
    size: 1024 * 512,
    path: '/',
    uploadTime: '2023-01-06',
    uploadUser: '张三',
  },
  {
    key: '7',
    id: 7,
    name: '说明.txt',
    type: 'text',
    size: 1024 * 5,
    path: '/',
    uploadTime: '2023-01-07',
    uploadUser: '李四',
  },
];

const File: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>(mockFiles);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [folderModalVisible, setFolderModalVisible] = useState<boolean>(false);
  const [fileDetailVisible, setFileDetailVisible] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [form] = Form.useForm();
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // 表格列定义
  const columns: ColumnsType<FileData> = [
    {
      title: '名称',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          {fileIconMap[record.type as keyof typeof fileIconMap] || fileIconMap.other}
          <span className="file-name" onClick={() => handleFileDblClick(record)}>
            {text}
          </span>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      sorter: (a, b) => a.size - b.size,
      render: (size) => (size === 0 ? '-' : formatFileSize(size)),
    },
    {
      title: '类型',
      dataIndex: 'type',
      filters: [
        { text: '文件夹', value: 'folder' },
        { text: '图片', value: 'image' },
        { text: 'Excel', value: 'excel' },
        { text: 'Word', value: 'word' },
        { text: 'PDF', value: 'pdf' },
        { text: '文本', value: 'text' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        let color = '';
        let text = type;
        
        switch (type) {
          case 'folder':
            color = 'gold';
            text = '文件夹';
            break;
          case 'image':
            color = 'blue';
            text = '图片';
            break;
          case 'excel':
            color = 'green';
            text = 'Excel';
            break;
          case 'word':
            color = 'geekblue';
            text = 'Word';
            break;
          case 'pdf':
            color = 'red';
            text = 'PDF';
            break;
          case 'text':
            color = '';
            text = '文本';
            break;
          default:
            color = '';
            text = '其他';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      sorter: (a, b) => a.uploadTime.localeCompare(b.uploadTime),
    },
    {
      title: '上传者',
      dataIndex: 'uploadUser',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.type !== 'folder' && (
            <Tooltip title="预览">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handlePreview(record)}
              />
            </Tooltip>
          )}
          {record.type !== 'folder' && (
            <Tooltip title="下载">
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="详情">
            <Button
              type="text"
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => handleFileDetail(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理文件行双击事件
  const handleFileDblClick = (record: FileData) => {
    if (record.type === 'folder') {
      // 进入文件夹
      const newPath = record.path === '/' ? `/${record.name}` : `${record.path}/${record.name}`;
      setCurrentPath(newPath);
      setSearchText('');
      setSelectedRowKeys([]);
    } else {
      // 预览文件
      handlePreview(record);
    }
  };

  // 处理文件预览
  const handlePreview = (record: FileData) => {
    message.info(`预览文件: ${record.name}`);
    // 在实际应用中，这里应该打开文件预览对话框或跳转到预览页面
  };

  // 处理文件下载
  const handleDownload = (record: FileData) => {
    message.success(`文件 "${record.name}" 开始下载`);
    // 在实际应用中，这里应该触发文件下载
  };

  // 处理文件删除
  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定删除所选文件吗？删除后将无法恢复。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setFiles(files.filter(file => file.key !== key));
        setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
        message.success('删除成功');
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的文件');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定删除选中的 ${selectedRowKeys.length} 个文件吗？删除后将无法恢复。`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setFiles(files.filter(file => !selectedRowKeys.includes(file.key)));
        setSelectedRowKeys([]);
        message.success(`成功删除 ${selectedRowKeys.length} 个文件`);
      },
    });
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 处理路径变化
  const handlePathChange = (path: string) => {
    setCurrentPath(path);
    setSearchText('');
    setSelectedRowKeys([]);
  };

  // 创建新文件夹
  const handleCreateFolder = () => {
    setFolderModalVisible(true);
    form.resetFields();
  };

  // 确认创建文件夹
  const handleFolderModalOk = () => {
    form.validateFields().then(values => {
      const { folderName } = values;
      const newFolder: FileData = {
        key: Date.now().toString(),
        id: Math.max(...files.map(f => f.id)) + 1,
        name: folderName,
        type: 'folder',
        size: 0,
        path: currentPath,
        uploadTime: new Date().toISOString().split('T')[0],
        uploadUser: '当前用户',
      };
      setFiles([...files, newFolder]);
      setFolderModalVisible(false);
      message.success(`成功创建文件夹: ${folderName}`);
    });
  };

  // 查看文件详情
  const handleFileDetail = (record: FileData) => {
    setCurrentFile(record);
    setFileDetailVisible(true);
  };

  // 打开上传对话框
  const handleUpload = () => {
    setUploadModalVisible(true);
    setFileList([]);
    setUploadProgress(0);
  };

  // 处理文件上传
  const handleFileUpload = () => {
    if (fileList.length === 0) {
      message.error('请选择要上传的文件');
      return;
    }

    setUploading(true);
    
    // 模拟上传进度
    let progress = 0;
    const timer = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          // 添加上传的文件到文件列表
          const newFiles = fileList.map(file => {
            const fileName = file.name;
            const fileType = getFileType(fileName);
            
            return {
              key: Date.now() + Math.random().toString(),
              id: Math.max(...files.map(f => f.id)) + 1,
              name: fileName,
              type: fileType,
              size: file.size || 0,
              path: currentPath,
              uploadTime: new Date().toISOString().split('T')[0],
              uploadUser: '当前用户',
            };
          });
          
          setFiles([...files, ...newFiles]);
          setUploading(false);
          setUploadModalVisible(false);
          message.success(`成功上传 ${fileList.length} 个文件`);
          setFileList([]);
          setUploadProgress(0);
        }, 500);
      }
    }, 200);
  };

  // 根据文件名获取文件类型
  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (!ext) return 'other';
    
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) {
      return 'image';
    } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
      return 'excel';
    } else if (['doc', 'docx'].includes(ext)) {
      return 'word';
    } else if (ext === 'pdf') {
      return 'pdf';
    } else if (['txt', 'md', 'json', 'xml', 'html', 'css', 'js'].includes(ext)) {
      return 'text';
    } else {
      return 'other';
    }
  };

  // 上传文件属性配置
  const uploadProps: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  // 过滤当前路径下的文件
  const getCurrentPathFiles = () => {
    return files.filter(file => {
      if (searchText) {
        return file.name.toLowerCase().includes(searchText.toLowerCase());
      }
      return file.path === currentPath;
    });
  };

  // 生成路径导航
  const renderPathNav = () => {
    const paths = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    // 根目录
    breadcrumbs.push(
      <span key="root" className="path-item" onClick={() => handlePathChange('/')}>
        根目录
      </span>
    );
    
    // 子目录
    let currentSegmentPath = '';
    paths.forEach((path, index) => {
      currentSegmentPath += `/${path}`;
      breadcrumbs.push(
        <span key={index + 1} className="path-separator">/</span>
      );
      breadcrumbs.push(
        <span 
          key={`path-${index}`} 
          className="path-item"
          onClick={() => handlePathChange(currentSegmentPath)}
        >
          {path}
        </span>
      );
    });
    
    return <div className="path-navigation">{breadcrumbs}</div>;
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="file-container">
      <Title level={2}>文件管理</Title>
      
      <Card bordered={false} className="file-card">
        <div className="file-header">
          <Row justify="space-between" align="middle" className="toolbar">
            <Col>
              <Space>
                <Button type="primary" icon={<UploadOutlined />} onClick={handleUpload}>
                  上传文件
                </Button>
                <Button icon={<FolderAddOutlined />} onClick={handleCreateFolder}>
                  新建文件夹
                </Button>
                <Button 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={handleBatchDelete}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量删除
                </Button>
              </Space>
            </Col>
            <Col>
              <Search
                placeholder="搜索文件"
                allowClear
                onSearch={handleSearch}
                style={{ width: 250 }}
              />
            </Col>
          </Row>
        </div>
        
        <div className="file-path">
          {renderPathNav()}
        </div>
        
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={getCurrentPathFiles()}
          rowKey="key"
          pagination={{ showSizeChanger: true, showQuickJumper: true }}
          className="file-table"
          onRow={(record) => ({
            onDoubleClick: () => handleFileDblClick(record),
          })}
        />
      </Card>
      
      {/* 新建文件夹对话框 */}
      <Modal
        title="新建文件夹"
        open={folderModalVisible}
        onOk={handleFolderModalOk}
        onCancel={() => setFolderModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          name="folderForm"
        >
          <Form.Item
            name="folderName"
            label="文件夹名称"
            rules={[
              { required: true, message: '请输入文件夹名称' },
              { max: 50, message: '文件夹名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入文件夹名称" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 文件详情对话框 */}
      <Modal
        title="文件详情"
        open={fileDetailVisible}
        footer={[
          <Button key="close" onClick={() => setFileDetailVisible(false)}>
            关闭
          </Button>
        ]}
        onCancel={() => setFileDetailVisible(false)}
      >
        {currentFile && (
          <div className="file-detail">
            <p><strong>文件名称:</strong> {currentFile.name}</p>
            <p><strong>文件类型:</strong> {currentFile.type}</p>
            <p><strong>文件大小:</strong> {currentFile.type === 'folder' ? '-' : formatFileSize(currentFile.size)}</p>
            <p><strong>文件路径:</strong> {currentFile.path}</p>
            <p><strong>上传时间:</strong> {currentFile.uploadTime}</p>
            <p><strong>上传用户:</strong> {currentFile.uploadUser}</p>
          </div>
        )}
      </Modal>
      
      {/* 上传文件对话框 */}
      <Modal
        title="上传文件"
        open={uploadModalVisible}
        onOk={handleFileUpload}
        onCancel={() => setUploadModalVisible(false)}
        confirmLoading={uploading}
        okText="上传"
        okButtonProps={{ disabled: fileList.length === 0 || uploading }}
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        
        {uploading && (
          <div className="upload-progress">
            <Progress percent={uploadProgress} status="active" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default File;