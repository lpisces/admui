import React, { useState } from 'react';
import { Card, Tree, Button, Input, Row, Col, Form, Modal, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';
import './index.less';

const { Title } = Typography;
const { Search } = Input;

// 模拟组织树数据
const initialTreeData: DataNode[] = [
  {
    title: '总公司',
    key: '0',
    children: [
      {
        title: '研发部',
        key: '0-0',
        children: [
          {
            title: '前端组',
            key: '0-0-0',
          },
          {
            title: '后端组',
            key: '0-0-1',
          },
          {
            title: '测试组',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '市场部',
        key: '0-1',
        children: [
          {
            title: '营销组',
            key: '0-1-0',
          },
          {
            title: '策划组',
            key: '0-1-1',
          },
        ],
      },
      {
        title: '财务部',
        key: '0-2',
      },
      {
        title: '人力资源部',
        key: '0-3',
      },
    ],
  },
];

const Organization: React.FC = () => {
  const [treeData, setTreeData] = useState<DataNode[]>(initialTreeData);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0', '0-0', '0-1']);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue: React.Key[]) => {
    setSelectedKeys(selectedKeysValue);
  };

  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key = '';
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else {
          const result = getParentKey(key, node.children);
          if (result) {
            parentKey = result;
          }
        }
      }
    }
    return parentKey;
  };

  const dataList: { key: React.Key; title: string }[] = [];
  const generateList = (data: DataNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title: title as string });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeData);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if ((item.title as string).indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const findNodeByKey = (key: React.Key, data: DataNode[]): { node: DataNode; path: number[] } | null => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return { node: data[i], path: [i] };
      }
      if (data[i].children) {
        const result = findNodeByKey(key, data[i].children || []);
        if (result) {
          return { node: result.node, path: [i, ...result.path] };
        }
      }
    }
    return null;
  };

  const addNode = () => {
    setModalTitle('添加组织');
    setEditingKey(null);
    form.resetFields();
    setModalVisible(true);
  };

  const editNode = () => {
    if (!selectedKeys.length) {
      message.warning('请先选择一个组织');
      return;
    }
    const selectedKey = selectedKeys[0].toString();
    const nodeInfo = findNodeByKey(selectedKey, treeData);
    if (nodeInfo) {
      setModalTitle('编辑组织');
      setEditingKey(selectedKey);
      form.setFieldsValue({ name: nodeInfo.node.title });
      setModalVisible(true);
    }
  };

  const handleDelete = () => {
    if (!selectedKeys.length) {
      message.warning('请先选择一个组织');
      return;
    }

    const deleteNode = (key: React.Key, data: DataNode[]): DataNode[] => {
      return data.filter((item) => {
        if (item.key === key) {
          return false;
        }
        if (item.children) {
          item.children = deleteNode(key, item.children);
        }
        return true;
      });
    };

    const newTreeData = deleteNode(selectedKeys[0], [...treeData]);
    setTreeData(newTreeData);
    setSelectedKeys([]);
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const { name } = values;

      if (editingKey) {
        // 编辑节点
        const updateTreeData = (list: DataNode[], key: React.Key, title: string): DataNode[] => {
          return list.map((node) => {
            if (node.key === key) {
              return {
                ...node,
                title,
              };
            }
            if (node.children) {
              return {
                ...node,
                children: updateTreeData(node.children, key, title),
              };
            }
            return node;
          });
        };

        setTreeData(updateTreeData(treeData, editingKey, name));
        message.success('编辑成功');
      } else {
        // 添加节点
        const newKey = selectedKeys.length ? `${selectedKeys[0]}-${Date.now()}` : `${Date.now()}`;
        const newNode: DataNode = {
          title: name,
          key: newKey,
        };

        if (selectedKeys.length) {
          // 添加为子节点
          const addTreeNode = (list: DataNode[], key: React.Key, child: DataNode): DataNode[] => {
            return list.map((node) => {
              if (node.key === key) {
                return {
                  ...node,
                  children: node.children ? [...node.children, child] : [child],
                };
              }
              if (node.children) {
                return {
                  ...node,
                  children: addTreeNode(node.children, key, child),
                };
              }
              return node;
            });
          };

          setTreeData(addTreeNode(treeData, selectedKeys[0], newNode));
        } else {
          // 添加为根节点
          setTreeData([...treeData, newNode]);
        }
        message.success('添加成功');
      }

      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const loop = (data: DataNode[]): DataNode[] =>
    data.map((item) => {
      const strTitle = item.title as string;
      const index = strTitle.indexOf(searchValue);
      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{strTitle}</span>
        );
      if (item.children) {
        return { ...item, title, children: loop(item.children) };
      }

      return {
        ...item,
        title,
      };
    });

  return (
    <div className="organization-container">
      <Title level={2}>组织管理</Title>
      <Row gutter={16}>
        <Col xs={24} md={10} lg={8}>
          <Card 
            title="组织架构" 
            bordered={false}
            extra={
              <div className="tree-actions">
                <Button type="text" icon={<PlusOutlined />} onClick={addNode} />
                <Button type="text" icon={<EditOutlined />} onClick={editNode} />
                <Popconfirm
                  title="确定要删除这个组织吗？"
                  description="删除后将无法恢复，其下级组织也会被删除！"
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={handleDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            }
          >
            <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={onChange} />
            <Tree
              showLine
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={loop(treeData)}
            />
          </Card>
        </Col>
        <Col xs={24} md={14} lg={16}>
          <Card title="组织详情" bordered={false}>
            {selectedKeys.length ? (
              <div className="org-detail">
                <p>这里可以展示组织的详细信息，如组织描述、负责人、创建时间等。</p>
              </div>
            ) : (
              <div className="org-empty">
                <p>请在左侧选择一个组织查看详情</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="组织名称"
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input placeholder="请输入组织名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Organization; 